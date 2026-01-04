<template>
  <div class="container">
    <h2>ĐĂNG KÝ & XÁC THỰC CĂN CƯỚC CÔNG DÂN</h2>

    <!-- Upload CCCD -->
    <div class="block">
      <label>Ảnh CCCD:</label>
      <input type="file" accept="image/*" @change="onCccdUpload" />
      <p v-if="cccdLoaded" class="ok">✔ Đã đọc khuôn mặt từ CCCD</p>
    </div>

    <!-- Camera -->
    <div class="block">
      <label>Camera xác thực khuôn mặt:</label><br />

      <button @click="startCamera" :disabled="cameraOn">
        📷 Bật camera & xác thực
      </button>

      <button @click="stopCamera" :disabled="!cameraOn">
        ⛔ Tắt camera
      </button>

      <br /><br />

      <video
        ref="video"
        width="320"
        height="240"
        autoplay
        muted
        playsinline
      ></video>

      <p v-if="message" :class="messageType">{{ message }}</p>
    </div>

    <div class="block debug">
      <p>Face Distance: {{ distance }}</p>
      <p>Retry: {{ retryCount }} / {{ MAX_RETRY }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import * as faceapi from 'face-api.js'

// ================= CONFIG =================
const MATCH_THRESHOLD = 0.45
const MAX_RETRY = 10

// ================= STATE =================
const video = ref(null)
const cccdLoaded = ref(false)
const cameraOn = ref(false)

const message = ref('')
const messageType = ref('')
const distance = ref(null)
const retryCount = ref(0)

let cccdDescriptor = null
let stream = null
let intervalId = null
let modelsLoaded = false

// ================= LOAD MODELS =================
const loadModels = async () => {
  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models')
    ])
    modelsLoaded = true
    console.log('✔ Models loaded')
  } catch (e) {
    alert('Không load được model face-api')
  }
}

// ================= LOAD CCCD =================
const onCccdUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  const img = await faceapi.bufferToImage(file)

  const detection = await faceapi
    .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor()

  if (!detection) {
    alert('Không phát hiện khuôn mặt trên CCCD')
    return
  }

  cccdDescriptor = detection.descriptor
  cccdLoaded.value = true
  message.value = 'Bật camera để xác thực'
  messageType.value = 'warn'
}

// ================= START CAMERA =================
const startCamera = async () => {
  if (!cccdLoaded.value) {
    alert('Vui lòng tải ảnh CCCD trước')
    return
  }

  if (!modelsLoaded) {
    alert('Model chưa sẵn sàng')
    return
  }

  try {
    await nextTick()

    stream = await navigator.mediaDevices.getUserMedia({ video: true })
    video.value.srcObject = stream
    await video.value.play()

    cameraOn.value = true
    retryCount.value = 0
    message.value = 'Giữ khuôn mặt thẳng và nhìn vào camera'
    messageType.value = 'warn'

    startFaceCompare()
    console.log('📷 Camera started')
  } catch (err) {
    alert('Không bật được camera')
    console.error(err)
  }
}

// ================= STOP CAMERA =================
const stopCamera = () => {
  if (stream) stream.getTracks().forEach(t => t.stop())
  stream = null
  cameraOn.value = false
  message.value = ''
  distance.value = null
  if (intervalId) clearInterval(intervalId)
}

// ================= FACE COMPARE =================
const startFaceCompare = () => {
  if (intervalId) clearInterval(intervalId)

  intervalId = setInterval(async () => {
    if (!cameraOn.value || !video.value) return
    if (video.value.readyState !== 4) return

    const detection = await faceapi
      .detectSingleFace(video.value, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor()

    if (!detection) {
      message.value = 'Đưa khuôn mặt vào khung hình'
      messageType.value = 'warn'
      return
    }

    const d = faceapi.euclideanDistance(
      detection.descriptor,
      cccdDescriptor
    )

    distance.value = d.toFixed(3)

    if (d < MATCH_THRESHOLD) {
      message.value = '✅ Xác thực thành công'
      messageType.value = 'ok'
      clearInterval(intervalId)
      return
    }

    retryCount.value++

    if (retryCount.value >= MAX_RETRY) {
      message.value = '❌ Khuôn mặt không khớp CCCD'
      messageType.value = 'fail'
      clearInterval(intervalId)
    } else {
      message.value = 'Điều chỉnh góc mặt / khoảng cách'
      messageType.value = 'warn'
    }
  }, 1200)
}

// ================= INIT =================
onMounted(loadModels)
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
}
.ok {
  color: green;
  font-weight: bold;
}
.fail {
  color: red;
  font-weight: bold;
}
.warn {
  color: orange;
  font-weight: bold;
}
video {
  border: 1px solid #ccc;
}
</style>

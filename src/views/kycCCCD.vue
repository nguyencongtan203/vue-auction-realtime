<template>
  <div class="min-h-[80vh] bg-slate-50 py-10">
    <div class="mx-auto max-w-4xl px-4">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="pb-4 text-2xl md:text-3xl font-semibold text-center text-slate-900">
          Xác thực căn cước công dân
        </h1>
        <p class="mt-2 text-slate-600">
          Tải ảnh CCCD có khuôn mặt rõ, sau đó bật camera để đối chiếu khuôn mặt.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <!-- Left: Steps -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Stepper -->
          <div class="rounded-2xl bg-white shadow-sm border border-slate-200 p-5">
            <div class=" pace-y-3">
              <StepRow
                :done="modelsLoaded"
                :active="!modelsLoaded"
                title="1) Tải model nhận diện"
                :desc="modelsLoaded ? 'Sẵn sàng' : 'Đang tải…'"
              />

              <StepRow
                :done="cccdLoaded"
                :active="modelsLoaded && !cccdLoaded"
                title="2) Tải ảnh CCCD"
                :desc="cccdLoaded ? 'Đã đọc khuôn mặt từ CCCD' : 'Chưa tải ảnh'"
              />

              <StepRow
                :done="verified"
                :active="cccdLoaded && cameraOn && !verified"
                title="3) Mở camera & đối chiếu"
                :desc="
                  verified ? 'Thành công' : cameraOn ? 'Đang so sánh…' : 'Chưa bật camera'
                "
              />
            </div>

            <!-- Tips -->
            <div class="rounded-xl bg-slate-50 border border-slate-200 p-4">
              <div class="text-sm font-medium text-slate-900">Mẹo để khớp nhanh</div>
              <ul class="mt-2 text-sm text-slate-600 space-y-1 list-disc pl-5">
                <li>Nhìn thẳng, ánh sáng đủ, không đội mũ/đeo khẩu trang.</li>
                <li>Giữ mặt nằm gọn trong khung, tránh rung camera.</li>
                <li>Ảnh CCCD nên rõ mặt và không bị chói sáng.</li>
              </ul>
            </div>
          </div>

          <!-- Upload CCCD Card -->
          <div class="rounded-2xl bg-white shadow-sm border border-slate-200 p-5">
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="text-base font-semibold text-slate-900">Ảnh CCCD</div>
                <div class="text-sm text-slate-600">
                  Chọn ảnh chứa khuôn mặt (mặt trước CCCD).
                </div>
              </div>

              <span
                class="shrink-0 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
                :class="
                  cccdLoaded
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-50 text-slate-600 border border-slate-200'
                "
              >
                {{ cccdLoaded ? "Đã tải" : "Chưa tải" }}
              </span>
            </div>

            <div class="mt-4">
              <label
                class="flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 hover:bg-slate-100 cursor-pointer"
              >
                <input
                  type="file"
                  class="hidden"
                  accept="image/*"
                  @change="onCccdUpload"
                  :disabled="!modelsLoaded"
                />
                <span class="text-sm font-medium text-slate-800">
                  {{ modelsLoaded ? "Chọn ảnh CCCD" : "Đang tải model…" }}
                </span>
              </label>

              <div v-if="cccdPreviewUrl" class="mt-4">
                <div class="text-sm text-slate-600 mb-2">Xem trước</div>
                <img
                  :src="cccdPreviewUrl"
                  class="w-full max-h-64 object-contain rounded-xl border border-slate-200 bg-white"
                  alt="CCCD preview"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Camera -->
        <div class="lg:col-span-3 space-y-6">
          <div class="rounded-2xl bg-white shadow-sm border border-slate-200 p-5">
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="text-base font-semibold text-slate-900">Camera xác thực</div>
                <div class="text-sm text-slate-600">
                  Bật camera và giữ mặt thẳng để hệ thống so sánh.
                </div>
              </div>

              <span
                class="shrink-0 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
                :class="
                  cameraOn
                    ? 'bg-sky-50 text-sky-700 border border-sky-200'
                    : 'bg-slate-50 text-slate-600 border border-slate-200'
                "
              >
                {{ cameraOn ? "Đang bật" : "Đang tắt" }}
              </span>
            </div>

            <!-- Controls -->
            <div class="mt-4 flex flex-wrap gap-3">
              <button
                class="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed"
                @click="startCamera"
                :disabled="cameraOn || !cccdLoaded || !modelsLoaded || busy"
              >
                Bật camera
              </button>

              <button
                class="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                @click="stopCamera"
                :disabled="!cameraOn"
              >
                Tắt camera
              </button>

              <button
                class="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                @click="resetAll"
                :disabled="busy"
              >
                Làm lại
              </button>
            </div>

            <!-- Video + Overlay -->
            <div class="mt-5">
              <div
                class="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-black"
              >
                <video
                  ref="video"
                  class="w-full h-[320px] md:h-[420px] object-cover"
                  autoplay
                  muted
                  playsinline
                ></video>

                <!-- Overlay guide -->
                <div
                  class="pointer-events-none absolute inset-0 flex items-center justify-center"
                >
                  <div
                    class="w-56 h-72 md:w-64 md:h-80 rounded-[40px] border-2 border-white/70"
                  ></div>
                </div>

                <!-- Status pill -->
                <div class="absolute left-3 top-3">
                  <span
                    class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border"
                    :class="statusPillClass"
                  >
                    {{ statusText }}
                  </span>
                </div>
              </div>

              <!-- Liveness challenge -->
              <div v-if="cameraOn && !verified" class="mt-4">
                <div class="text-sm">
                  <span class="text-slate-600">Liveness: </span>
                  <span
                    class="font-semibold"
                    :class="livenessPassed ? 'text-emerald-700' : 'text-amber-700'"
                  >
                    {{ livenessPassed ? "Đã qua" : "Chưa qua" }}
                  </span>
                </div>

                <div v-if="!livenessPassed" class="mt-2 text-sm text-slate-700">
                  Yêu cầu: <span class="font-semibold">{{ challengeText }}</span>
                  <span class="text-slate-500"
                    >({{ challengeIndex + 1 }}/{{ CHALLENGES_TOTAL }})</span
                  >
                </div>
              </div>

              <!-- Result line -->
              <div
                class="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
              >
                <div class="text-sm">
                  <span class="text-slate-600">Kết quả: </span>
                  <span :class="resultTextClass">{{ message || "Chưa bắt đầu" }}</span>
                </div>

                <div class="flex items-center gap-4 text-sm text-slate-600">
                  <div>
                    Thử lại:
                    <span class="font-semibold text-slate-900"
                      >{{ retryCount }} / {{ MAX_RETRY }}</span
                    >
                  </div>
                </div>
              </div>

              <!-- Progress -->
              <div class="mt-4">
                <div
                  class="h-2 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200"
                >
                  <div
                    class="h-full bg-sky-600 transition-all"
                    :style="{ width: progressWidth }"
                  ></div>
                </div>
                <div class="mt-2 text-xs text-slate-500">
                  Tiến độ kiểm tra: {{ Math.min(retryCount, MAX_RETRY) }} /
                  {{ MAX_RETRY }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import axios from "axios";
import * as faceapi from "face-api.js";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/userStore";

const userStore = useUserStore?.() ? useUserStore() : null;
const verifyingKyc = ref(false);
const kycUpdated = ref(false);

async function callVerifyKycApi() {
  if (verifyingKyc.value || kycUpdated.value) return;

  const token = userStore?.token || null;
  if (!token) {
    message.value = "Thiếu token đăng nhập. Đăng nhập lại đi.";
    messageType.value = "fail";
    return;
  }

  verifyingKyc.value = true;
  try {
    const res = await axios.put(`${API}/auth/verify-kyc`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { code, message: msg } = res.data || {};
    if (code === 200) {
      kycUpdated.value = true;
      message.value = msg || "Xác thực KYC thành công (đã cập nhật trạng thái)";
      messageType.value = "ok";

      await userStore?.fetchUser?.();
      router.push("/user-info");
    } else {
      message.value = msg || "Gọi API verify-kyc thất bại";
      messageType.value = "fail";
    }
  } catch (err) {
    const serverMsg =
      err?.response?.data?.message || err?.message || "Lỗi gọi verify-kyc";
    message.value = serverMsg;
    messageType.value = "fail";
  } finally {
    verifyingKyc.value = false;
  }
}

const API = "http://localhost:8082/api";
const getImageUrl = (tenanh) => `${API}/imgs/kyc/${tenanh}`;

const router = useRouter();
const route = useRoute();

async function urlToFile(url, filename = "cccd-front.jpg") {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Không tải được ảnh CCCD từ server");
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type || "image/jpeg" });
}
async function loadCccdFromFile(file) {
  if (!file) return;
  if (!modelsLoaded) return;

  busy.value = true;
  try {
    if (cccdPreviewUrl.value) URL.revokeObjectURL(cccdPreviewUrl.value);
    cccdPreviewUrl.value = URL.createObjectURL(file);

    const img = await faceapi.bufferToImage(file);

    const detection = await faceapi
      .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      cccdLoaded.value = false;
      cccdDescriptor = null;
      message.value = "Không phát hiện khuôn mặt trên CCCD. Thử ảnh rõ hơn.";
      messageType.value = "fail";
      return;
    }

    cccdDescriptor = detection.descriptor;
    cccdLoaded.value = true;

    verified.value = false;
    retryCount.value = 0;
    distance.value = null;

    message.value = "Đã lấy ảnh CCCD từ tài khoản. Bật camera để đối chiếu.";
    messageType.value = "warn";
  } finally {
    busy.value = false;
  }
}

// ================= CONFIG =================
const MATCH_THRESHOLD = 0.4;
const MAX_RETRY = 10;
const INTERVAL_MS = 800;

// Liveness
const CHALLENGES_TOTAL = 3;
const HOLD_FRAMES_REQUIRED = 3;

const YAW_THRESHOLD = 0.18;
const MOUTH_OPEN_THRESHOLD = 0.35;

// gần/xa: dựa trên kích thước mặt trong khung hình (inter-eye)
const CLOSER_FACTOR = 1.25;
const FARTHER_FACTOR = 0.8;

// ================= STATE =================
const video = ref(null);
const cccdLoaded = ref(false);
const cameraOn = ref(false);
const verified = ref(false);

const message = ref("");
const messageType = ref(""); // ok | fail | warn
const distance = ref(null);
const retryCount = ref(0);
const busy = ref(false);

const cccdPreviewUrl = ref("");

// Liveness state
const livenessPassed = ref(false);
const challengeIndex = ref(0);
const challengeText = ref("");
let challenges = [];
let holdFrames = 0;
let baselineInterEye = null;

let cccdDescriptor = null;
let stream = null;
let intervalId = null;
let modelsLoaded = false;

const statusText = computed(() => {
  if (!modelsLoaded) return "Loading models";
  if (verified.value) return "Verified";
  if (cameraOn.value) return "Comparing";
  return "Idle";
});

const statusPillClass = computed(() => {
  if (!modelsLoaded) return "bg-amber-50 text-amber-700 border-amber-200";
  if (verified.value) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (cameraOn.value) return "bg-sky-50 text-sky-700 border-sky-200";
  return "bg-slate-50 text-slate-600 border-slate-200";
});

const resultTextClass = computed(() => {
  if (messageType.value === "ok") return "text-emerald-700 font-semibold";
  if (messageType.value === "fail") return "text-red-600 font-semibold";
  if (messageType.value === "warn") return "text-amber-700 font-semibold";
  return "text-slate-700";
});

const progressWidth = computed(() => {
  const p = (Math.min(retryCount.value, MAX_RETRY) / MAX_RETRY) * 100;
  return `${p}%`;
});

// ================= LOAD MODELS =================
const loadModels = async () => {
  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
    ]);

    modelsLoaded = true;
    message.value = "Tải ảnh CCCD để bắt đầu";
    messageType.value = "warn";

    // AUTO LOAD CCCD FRONT nếu có query
    const front = route.query.front;
    if (front) {
      const url = getImageUrl(front);
      const file = await urlToFile(url, String(front));
      await loadCccdFromFile(file);
    }
  } catch (e) {
    alert("Không load được model face-api. Check lại /models và server static.");
  }
};

// ================= LOAD CCCD =================
const onCccdUpload = async (e) => {
  const file = e.target.files?.[0];
  await loadCccdFromFile(file);
};

// ================= CAMERA =================
const startCamera = async () => {
  if (!cccdLoaded.value) {
    alert("Vui lòng tải ảnh CCCD trước");
    return;
  }
  if (!modelsLoaded) {
    alert("Model chưa sẵn sàng");
    return;
  }

  busy.value = true;
  try {
    await nextTick();

    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
      audio: false,
    });

    video.value.srcObject = stream;
    await video.value.play();

    cameraOn.value = true;
    verified.value = false;
    retryCount.value = 0;

    initLiveness();

    message.value = "Giữ mặt trong khung và làm liveness trước";
    messageType.value = "warn";

    startFaceCompare();
  } catch (err) {
    alert("Không bật được camera (hoặc user chặn quyền).");
  } finally {
    busy.value = false;
  }
};

const stopCamera = () => {
  if (stream) stream.getTracks().forEach((t) => t.stop());
  stream = null;
  cameraOn.value = false;

  if (intervalId) clearInterval(intervalId);
  intervalId = null;
};

const resetAll = () => {
  stopCamera();

  cccdLoaded.value = false;
  verified.value = false;
  cccdDescriptor = null;

  message.value = "Tải ảnh CCCD để bắt đầu";
  messageType.value = "warn";

  distance.value = null;
  retryCount.value = 0;
  // liveness reset
  livenessPassed.value = false;
  challengeIndex.value = 0;
  challengeText.value = "";
  challenges = [];
  holdFrames = 0;
  baselineInterEye = null;

  if (cccdPreviewUrl.value) {
    URL.revokeObjectURL(cccdPreviewUrl.value);
    cccdPreviewUrl.value = "";
  }
};

// ================= LIVENESS METRICS =================
const dist2 = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

const getInterEye = (pts) => {
  // dùng 2 điểm khóe mắt ngoài: 36 và 45
  const leftEyeOuter = pts[36];
  const rightEyeOuter = pts[45];
  return Math.max(1, dist2(leftEyeOuter, rightEyeOuter));
};

const calcYaw = (pts) => {
  const nose = pts[30];
  const midEyeX = (pts[36].x + pts[45].x) / 2;
  const interEye = getInterEye(pts);
  return (nose.x - midEyeX) / interEye;
};

const calcMouthOpen = (pts) => {
  // inner lips: 62(top), 66(bottom)
  const interEye = getInterEye(pts);
  return dist2(pts[62], pts[66]) / interEye;
};

// ================= LIVENESS CHALLENGES =================
const CHALLENGE = {
  TURN_LEFT: "TURN_LEFT",
  TURN_RIGHT: "TURN_RIGHT",
  OPEN_MOUTH: "OPEN_MOUTH",
  MOVE_CLOSER: "MOVE_CLOSER",
  MOVE_FARTHER: "MOVE_FARTHER",
};

const pickChallenges = () => {
  const pool = [
    CHALLENGE.TURN_LEFT,
    CHALLENGE.TURN_RIGHT,
    CHALLENGE.OPEN_MOUTH,
    CHALLENGE.MOVE_CLOSER,
    CHALLENGE.MOVE_FARTHER,
  ];

  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, CHALLENGES_TOTAL);
};

const challengeToText = (c) => {
  switch (c) {
    case CHALLENGE.TURN_LEFT:
      return "Quay mặt sang TRÁI (vừa phải)";
    case CHALLENGE.TURN_RIGHT:
      return "Quay mặt sang PHẢI (vừa phải)";
    case CHALLENGE.OPEN_MOUTH:
      return "Há miệng (mở rõ một chút)";
    case CHALLENGE.MOVE_CLOSER:
      return "Đưa mặt LẠI GẦN camera";
    case CHALLENGE.MOVE_FARTHER:
      return "Đưa mặt RA XA camera";
    default:
      return "Làm theo hướng dẫn";
  }
};

const initLiveness = () => {
  livenessPassed.value = false;
  challengeIndex.value = 0;
  holdFrames = 0;
  baselineInterEye = null;

  challenges = pickChallenges();
  challengeText.value = challengeToText(challenges[0]);
};

const checkChallenge = (pts, current) => {
  const yaw = calcYaw(pts);
  const mouthOpen = calcMouthOpen(pts);
  const interEye = getInterEye(pts);

  // set baseline khi user nhìn tương đối thẳng
  if (!baselineInterEye) {
    if (Math.abs(yaw) < 0.1) baselineInterEye = interEye;
  }

  switch (current) {
    case CHALLENGE.TURN_LEFT:
      return yaw < -YAW_THRESHOLD;

    case CHALLENGE.TURN_RIGHT:
      return yaw > YAW_THRESHOLD;

    case CHALLENGE.OPEN_MOUTH:
      return mouthOpen > MOUTH_OPEN_THRESHOLD;

    case CHALLENGE.MOVE_CLOSER:
      if (!baselineInterEye) return false;
      return interEye > baselineInterEye * CLOSER_FACTOR;

    case CHALLENGE.MOVE_FARTHER:
      if (!baselineInterEye) return false;
      return interEye < baselineInterEye * FARTHER_FACTOR;

    default:
      return false;
  }
};

const advanceChallengeIfPassed = () => {
  challengeIndex.value++;
  holdFrames = 0;

  if (challengeIndex.value >= challenges.length) {
    livenessPassed.value = true;
    challengeText.value = "OK";
    message.value = "Qua liveness. Giờ mới bắt đầu so khớp CCCD.";
    messageType.value = "warn";
    return;
  }

  challengeText.value = challengeToText(challenges[challengeIndex.value]);
  message.value = `Liveness: ${challengeText.value}`;
  messageType.value = "warn";
};

// ================= FACE LOOP =================
const startFaceCompare = () => {
  if (intervalId) clearInterval(intervalId);

  intervalId = setInterval(async () => {
    if (!cameraOn.value || !video.value) return;
    if (video.value.readyState !== 4) return;
    if (!cccdDescriptor) return;

    const detection = await faceapi
      .detectSingleFace(video.value, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      message.value = "Đưa khuôn mặt vào khung hình";
      messageType.value = "warn";
      return;
    }

    // 1) LIVENESS trước
    if (!livenessPassed.value) {
      const pts = detection.landmarks.positions;
      const current = challenges[challengeIndex.value];

      const ok = checkChallenge(pts, current);

      if (ok) {
        holdFrames++;
        message.value = `Đang kiểm tra: ${challengeText.value} (${holdFrames}/${HOLD_FRAMES_REQUIRED})`;
        messageType.value = "warn";

        if (holdFrames >= HOLD_FRAMES_REQUIRED) {
          advanceChallengeIfPassed();
        }
      } else {
        holdFrames = 0;
        message.value = `Liveness: ${challengeText.value}`;
        messageType.value = "warn";
      }

      return;
    }

    // 2) SO KHỚP CCCD
    const d = faceapi.euclideanDistance(detection.descriptor, cccdDescriptor);
    distance.value = Number(d).toFixed(3);

    if (d < MATCH_THRESHOLD) {
      verified.value = true;

      // stop loop trước cho khỏi gọi lặp
      clearInterval(intervalId);
      intervalId = null;

      message.value = "Xác thực thành công. Đang cập nhật trạng thái KYC…";
      messageType.value = "warn";

      await callVerifyKycApi();

      return;
    }

    retryCount.value++;

    if (retryCount.value >= MAX_RETRY) {
      message.value = "Khuôn mặt không khớp CCCD";
      messageType.value = "fail";

      clearInterval(intervalId);
      intervalId = null;
    } else {
      message.value = "Chưa khớp. Giữ thẳng mặt, đủ sáng, gần vừa phải.";
      messageType.value = "warn";
    }
  }, INTERVAL_MS);
};

// ================= INIT =================
onMounted(loadModels);

// ================= LOCAL COMPONENT: StepRow =================
const StepRow = {
  props: {
    done: Boolean,
    active: Boolean,
    title: String,
    desc: String,
  },
  template: `
    <div class="flex items-start gap-3">
      <div
        class="mt-0.5 h-5 w-5 rounded-full border flex items-center justify-center text-xs font-bold"
        :class="done ? 'bg-emerald-600 text-white border-emerald-600' : active ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-slate-400 border-slate-300'"
      >
        <span v-if="done">✓</span>
        <span v-else>•</span>
      </div>
      <div class="min-w-0">
        <div class="text-sm font-medium text-slate-900">{{ title }}</div>
        <div class="text-xs text-slate-600">{{ desc }}</div>
      </div>
    </div>
  `,
};
</script>
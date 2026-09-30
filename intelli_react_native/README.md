# React Native Course App

A modern, offline-first Bare React Native mobile application built with **TypeScript**, **React Context & Custom Hooks**, **Repository pattern**, **Native SQLite (op-sqlite)**, **NetInfo connectivity listener**, and **React Native Toast Message**.

---

##  Project Overview

The React Native Course App allows users to log in, browse available courses on an interactive dashboard, and view detailed lesson plans for any selected course. It features robust offline access, ensuring courses and progress remain available even when the network is unreachable, backed by a C++/JSI native SQLite database and real-time NetInfo network listening.

---

##  Features

- **Authentication & Login**:
  - Modern floating card interface on a subtle gray background with clean typography.
  - Prefilled default demo credentials (`student@example.com` / `secret123`) for quick access.
  - Interactive **Demo Credentials** reference banner embedded in the card.
  - Email and password input fields with inline validation and dynamic error clearing on text change.
  - Strict email format validation matching valid username, domain, and top-level domain.
  - Top toast alerts (`react-native-toast-message`) on invalid or missing email IDs (on blur and submit) for immediate user feedback.
  - Password validation with minimum 6 characters requirement.
  - Loading spinner state during authentication.
  - Informative error banners on authentication failure.
  - Seamless navigation to Dashboard with back-stack clearing (`navigation.reset`) preventing back navigation to login.

- **Course Dashboard**:
  - Displays course cards with course title, instructor, real-time progress percentage bar, and lesson count.
  - Complete UI state handling: **Loading**, **Success**, **Empty**, and **Error** (with interactive `Retry` button).
  - Inline real-time **Online/Offline status pill badge** with one-tap offline simulation toggle directly in the header bar.
  - Dedicated **header refresh button (↻)** alongside native pull-to-refresh (`RefreshControl`).
  - Hardware-aware Safe Area padding dynamically handling status bar, camera cutouts, and notches.

- **Course Details & Lessons (Native SQLite)**:
  - Detailed view with course header card and overall completion status (`X of Y completed`).
  - Read-only lesson list with visual status indicators (`✓ Completed` and `○ Pending`).
  - Accurate progress bar matching SQLite / API data.
  - **Read-Only Policy**: Course progress and lesson completion statuses are strictly viewable and non-editable in the frontend.

- **Offline-First Resilience**:
  - Remote-first caching into high-performance native SQLite (`@op-engineering/op-sqlite`).
  - Transparent fallback to SQLite cache if network fails.
  - Previously loaded courses and lessons remain accessible offline with the inline offline status badge.

---

##  Architecture

The app strictly follows modern layered Clean Architecture guidelines with separation of concerns:

```
┌────────────────────────────────────────────────────────┐
│                   UI / Presentation                    │
│   LoginScreen      DashboardScreen     CourseDetails   │
│   OfflineBanner    CourseCard          LessonRow       │
│   ProgressBar      ErrorBoundary       Toast           │
└───────────────────────────┬────────────────────────────┘
                            │ Consumes Hooks & State
                            ▼
┌────────────────────────────────────────────────────────┐
│             Custom Hooks / State Management            │
│   useAuth          useCourses          useCourseDetails│
│             useNetwork (NetInfo listener)              │
└───────────────────────────┬────────────────────────────┘
                            │ Calls Repository APIs
                            ▼
┌────────────────────────────────────────────────────────┐
│                    Repository Layer                    │
│      AuthRepository       │     CourseRepository       │
└───────────────────────────┬────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
      Remote Mock API              Native SQLite (C++/JSI)
      (CourseApi / JSON)           (CourseDao & LessonDao)
```

- **Clean Boundaries**: UI components never directly execute raw SQL queries or fetch remote APIs.
- **State Management**: Built with React Context (`AuthContext`, `NetworkContext`) and Custom Hooks (`useCourses`, `useCourseDetails`, `useNetwork`)—avoiding third-party state store overhead while SQLite serves as the persistent source of truth.
- **Single Source of Truth**: Native SQLite database (`CourseApp.db`) serves as the local source of truth with indexed `updated_at` on courses and foreign-key `CASCADE` constraints on lessons.

---

##  Tech Stack

| Component | Technology | Version |
|---|---|---|
| **Framework** | Bare React Native (Community CLI) | 0.87.1 |
| **Language** | TypeScript | 6.0.3 |
| **React Runtime** | React | 19.2.3 |
| **Native Navigation** | `@react-navigation/native` & `@react-navigation/native-stack` | 7.5.0 / 7.20.0 |
| **Screen Optimization** | `react-native-screens` & `react-native-safe-area-context` | 4.28.0 / 5.5.2 |
| **Local Database** | Native SQLite (`@op-engineering/op-sqlite`) | 18.2.5 (C++/JSI) |
| **Network Listener** | `@react-native-community/netinfo` | 12.0.1 |
| **Toast Alerts** | `react-native-toast-message` | 2.5.2 |
| **Testing** | Jest & React Test Renderer | 29.6.3 / 19.2.3 |
| **Build Tools** | Gradle 9.4.1 (Android) & CocoaPods (iOS) | AGP / Xcode |

---

##  Error Handling & Debugging Strategy

The application applies structured error handling and debugging patterns across every architectural layer:

1. **Repository Layer & Cache Fallback**:
   - Operations gracefully handle network loss by consulting `@react-native-community/netinfo`.
   - When remote network operations fail, `CourseRepository` seamlessly falls back to the local SQLite cache, ensuring uninterrupted offline availability. If both remote and local fail, typed errors (`NetworkError`, `DatabaseError`) are raised.
2. **Real-Time Network Monitoring**:
   - `NetworkContext` listens to NetInfo state changes in real time.
   - The UI displays an animated `OfflineBanner`, and the dashboard automatically reflects network recovery.
3. **Global React Error Boundary**:
   - An `<ErrorBoundary>` wraps the application to catch unexpected render crashes, providing a user-friendly recovery UI with a **"Try Again"** button.
   - In `__DEV__` mode, an expandable accordion provides the full component stack trace for rapid debugging.
4. **Global JS Runtime Interceptors**:
   - `initGlobalErrorHandlers()` hooks into `ErrorUtils.setGlobalHandler` to catch and log uncaught exceptions.
   - Unhandled promise rejection tracking intercepts asynchronous rejections before they crash the runtime.
5. **Input Validation & Toast Notifications**:
   - Inputs are validated locally before authentication requests.
   - Invalid email submissions immediately trigger inline error hints and top toast alerts via `react-native-toast-message` both on input blur and on form submission.
6. **Diagnostic & Benchmark Tooling**:
   - Tagged `Logger` (`[API]`, `[SQLITE]`, `[AUTH]`, `[NETINFO]`, etc.) silences verbose logs in release builds while formatting readable timestamps in development.
   - Internal microsecond-accurate benchmark timers (`Logger.time` / `Logger.timeEnd`) measure bulk SQLite operations.
   - Simulated network failure hook in `courseApi.ts` via `setFailNext(true)`.

---

##  Offline Strategy

1. **Remote Fetch**: When courses are requested, `CourseRepository` contacts `CourseApi`.
2. **Local Cache**: On successful remote response, courses and lesson skeletons are persisted into native SQLite inside atomic transactions.
3. **Offline Fallback**: If `CourseApi` fails or the device is disconnected, `CourseRepository` queries native SQLite for cached courses.
   - If cached courses exist: They are returned with an offline indicator badge (`Offline Mode: Showing cached courses`). No error screen is shown.
   - If cache is empty and remote fails: An error state is emitted, showing an informative message with a `Retry` button.
4. **Read-Only Lessons**: Lessons query SQLite directly using an indexed `course_id` query, maintaining instant offline responsiveness.

```
Request Courses
      │
      ▼
Try Remote API? ─── Success ───► Save to SQLite ───► Return Courses
      │
    Failed
      │
      ▼
Check SQLite Cache? ─── Has Data ──► Return Cached Courses (Offline Badge)
      │
    Empty
      │
      ▼
Return Error State (Display Retry Button)
```

---

##  Testing

The project includes Jest unit test suites with **26 passing tests**:

- **`progressCalculator.test.ts`** (7 tests): Validates mathematical correctness of the business logic:
  - 0 / 4 → 0%
  - 1 / 4 → 25%
  - 2 / 4 → 50%
  - 3 / 4 → 75%
  - 4 / 4 → 100%
  - Edge cases: 0 / 0 → 0%, negative completed lessons → 0%, completed > total → 100%.
- **`validation.test.ts`** (7 tests): Tests RFC-compliant email formatting, missing/empty inputs, and minimum 6-character password rules.
- **`authRepository.test.ts`** (4 tests): Tests successful login with demo credentials, case-insensitive email matching, 401 rejection on wrong password, and 401 rejection on unknown user.
- **`errorHandler.test.ts`** (5 tests): Tests `normalizeError` with `AppError` instances, standard JavaScript `Error` objects, raw strings, unknown arbitrary objects, and `DatabaseError`.
- **`toast.test.ts`** (3 tests): Tests `showToast.error`, `showToast.success`, and `showToast.info` dispatches.
- **`App.test.tsx`** (1 test): Verifies root app mounting, providers setup, and navigation hierarchy.

### Running Tests

Run all unit tests from the terminal:

```bash
npm test
```

Run TypeScript and ESLint checks:

```bash
# Type checking
npx tsc --noEmit

# Linting
npm run lint
```

---

##  How to Run

### Prerequisites

- Node.js `>= 22.11.0`
- JDK 17
- Android Studio (for Android Emulator) or Xcode (for iOS Simulator)
- CocoaPods (`pod install` in `ios/`)

### Terminal 1 — Start Metro Bundler

```bash
npx react-native start
```

### Terminal 2 — Run on Android

```bash
npx react-native run-android
```

Or assemble the debug APK directly via Gradle:

```bash
cd android
./gradlew assembleDebug
cd ..
```

### Terminal 2 — Run on iOS

```bash
# First time setup
cd ios && pod install && cd ..

# Launch iOS Simulator
npx react-native run-ios
```

---

##  Assumptions & Scope

- **Mock Authentication**: Simulates credentials verification against predefined credentials (`student@example.com` / `secret123`) with a 1000ms delay.
- **Mock Course API**: Simulated network latency (800ms) with predefined seed courses and lessons matching specifications.
- **Read-Only Completion Status**: In accordance with project requirements, course progress and lesson completion statuses are strictly viewable and not editable from the frontend.
- **Side-by-Side Coexistence**: The app package name is configured as `com.courseapp.reactnative` (with launcher name `Course App RN`) so it can be installed alongside the Kotlin Android app (`com.example.courseapp`) on the same device for direct benchmarking.

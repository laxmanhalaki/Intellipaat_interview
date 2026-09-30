# Android Course App

A modern, offline-first Android application built with **Jetpack Compose**, **MVVM architecture**, **Repository pattern**, **Room database**, and **Hilt dependency injection**.

---

##  Project Overview

The Android Course App allows users to log in, browse available courses on a dashboard, view detailed lesson plans for any selected course, and interactively track lesson completion. It supports robust offline access, ensuring courses and progress remain available even when the network is unreachable.

---

##  Features

- **Authentication & Login**:
  - Modern floating card interface on a subtle gray background with clean typography.
  - Prefilled default demo credentials (`student@example.com` / `secret123`) for quick access.
  - Interactive **Demo Credentials** reference banner embedded in the card.
  - Email and password input fields with inline validation and instant error clearing on input.
  - Strict email format validation with regex matching valid username, domain, and top-level domain.
  - Android Toast alerts on invalid or missing email IDs for immediate user feedback.
  - One-off UI side-effect events (`LoginUiEvent.ShowToast`) using buffered coroutine channels.
  - Password validation with minimum 6 characters requirement.
  - Loading spinner state during authentication.
  - Informative error banners on authentication failure.
  - Seamless navigation to Dashboard with back-stack clearing (preventing back navigation to login).

- **Course Dashboard**:
  - Displays course cards with course title, instructor, real-time progress percentage bar, and lesson count.
  - Complete UI state handling: **Loading**, **Success**, **Empty**, and **Error** (with interactive `Retry` button).
  - One-tap **Offline/Online simulation toggle** in the app bar for testing cache fallback behavior.

- **Course Details & Interactive Lessons**:
  - Detailed view with course header card and overall completion status (`X of Y completed`).
  - Interactive lesson list with Material icons (`✓ Completed` and `○ Pending`).
  - Immediate local progress recalculation using a decoupled business logic calculator.
  - Reactive updates: progress updates persist in Room and immediately reflect on the Dashboard.

- **Offline-First Resilience**:
  - Remote-first caching into Room SQLite database.
  - Transparent fallback to Room cache if network fails.
  - Lesson toggling works offline without network dependency.

---

##  Architecture

The app strictly follows modern Android Architecture guidelines with separation of concerns:

```
┌────────────────────────────────────────────────────────┐
│               Presentation Layer (Compose)             │
│   LoginScreen  │  DashboardScreen  │  CourseDetailsScreen │
│   (StateFlow UI State + Channel One-Off Side Effects) │
└───────────────────────────┬────────────────────────────┘
                            │ Collects StateFlow / Events
                            ▼
┌────────────────────────────────────────────────────────┐
│                   ViewModel Layer                      │
│   LoginViewModel │ DashboardViewModel │ DetailsViewModel│
└───────────────────────────┬────────────────────────────┘
                            │ Calls Coroutine APIs
                            ▼
┌────────────────────────────────────────────────────────┐
│                  Repository Layer                      │
│     AuthRepository       │     CourseRepository        │
└───────────────────────────┬────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
      Remote Mock API              Room Local Database
     (CourseApi / JSON)            (AppDatabase / DAO)
```

- **Clean Boundaries**: The UI never directly talks to Room or the remote API.
- **StateFlow & Immutability**: ViewModels expose immutable `StateFlow<UiState>` collected lifecycle-aware in Compose.
- **Single Source of Truth**: Room serves as the local database source of truth.

---

##  Tech Stack

| Component | Technology | Version |
|---|---|---|
| **Language** | Kotlin | 2.0.21 |
| **UI Framework** | Jetpack Compose (Material 3) | BOM 2024.11.00 |
| **Architecture** | MVVM + Repository Pattern | Clean Architecture |
| **Dependency Injection** | Dagger Hilt | 2.51.1 |
| **Local Database** | Room | 2.6.1 |
| **Async & Concurrency** | Kotlin Coroutines & Flow / StateFlow / Channel | 1.9.0 |
| **Navigation** | Navigation Compose | 2.8.5 |
| **Testing** | JUnit 4, Kotlinx Coroutines Test | 4.13.2 / 1.9.0 |
| **Build System** | Gradle Kotlin DSL with Version Catalog | AGP 8.7.3 / Gradle 8.11.1 |

---

##  Error Handling & Debugging Strategy

The application applies structured error handling and debugging patterns across every architectural layer:

1. **Repository Layer (`Result<T>` & Cache Fallback)**:
   - Data operations return Kotlin `Result<T>` to encapsulate success and failure explicitly without crashing.
   - When remote network operations fail, `CourseRepository` gracefully falls back to local Room cache, ensuring offline availability. If both remote and local fail, descriptive exceptions are bubbled up.
2. **Real-Time Network Monitoring**:
   - `ConnectivityObserver` uses Android's `ConnectivityManager.NetworkCallback` to broadcast real-time connection status.
   - Screens show offline warning chips/banners, and `DashboardViewModel` automatically reloads and synchronizes data when the network is restored.
3. **Unidirectional UI State Modeling (MVI/UDF)**:
   - UI states are modeled as sealed classes (`Loading`, `Success`, `Error(message)`, `Empty`) or explicit state data classes (`LoginUiState`), preventing invalid or partial UI states.
   - Screen-level error views feature retry actions to easily recover from failures.
4. **Input Validation & Side-Effect Feedback**:
   - Validation occurs before any network call.
   - Form fields show immediate inline error hints and clear errors dynamically as the user types.
   - Invalid email submissions emit one-off `LoginUiEvent.ShowToast` events via buffered coroutine channels to display Android Toasts without recomposition side effects.
5. **Debugging & Testing Simulation Hooks**:
   - `AuthRepositoryImpl` includes a failure hook (any email containing `"fail"`, e.g. `fail@example.com`) to allow deterministic manual and automated testing of authentication failure states.
   - Deterministic coroutine testing using `StandardTestDispatcher` and `advanceUntilIdle()` ensures reliable test execution without race conditions.

---

##  Offline Strategy

1. **Remote Fetch**: When courses are requested, `CourseRepository` contacts `CourseApi`.
2. **Local Cache**: On successful remote response, courses and lesson skeletons are persisted into Room.
3. **Offline Fallback**: If `CourseApi` throws an exception (e.g. simulated network failure or airplane mode), `CourseRepository` queries Room for cached courses.
   - If cached courses exist: They are returned with an offline indicator badge (`Offline Mode: Showing cached courses from Room`). No error screen is shown.
   - If cache is empty and remote fails: An error state is emitted, showing an informative message with a `Retry` button.
4. **Lesson Updates**: Lesson completion toggles are executed directly against the local Room database, immediately triggering progress recalculation without network reliance.

```
Request Courses
      │
      ▼
Try Remote API? ─── Success ───► Save to Room ───► Return Courses
      │
    Failed
      │
      ▼
Check Room Cache? ─── Has Data ──► Return Cached Courses (Offline Badge)
      │
    Empty
      │
      ▼
Return Error State (Display Retry Button)
```

---

##  Testing

The project includes unit test suites with **20 passing tests**:

- **`ProgressCalculatorTest`** (8 tests): Validates mathematical correctness of the business logic:
  - 0 / 4 → 0%
  - 1 / 4 → 25%
  - 2 / 4 → 50%
  - 3 / 4 → 75%
  - 4 / 4 → 100%
  - Edge cases: 0 / 0 → 0%, negative completed lessons → 0%, completed > total → 100%.
- **`LoginViewModelTest`** (6 tests): Tests form validation (empty email/password with Toast notification, invalid email format with Toast notification, email regex helper validation, password < 6 chars), loading states, and auth success/failure transitions.
- **`CourseRepositoryTest`** (6 tests): Tests remote-to-Room caching, offline fallback to cache upon network error, error handling on empty cache, and lesson completion progress recalculation.

### Running Tests

Run all unit tests from the terminal:

```bash
./gradlew testDebugUnitTest
```

---

##  How to Run

### In Android Studio

1. Open **Android Studio** (Ladybug / Koala / Hedgehog or newer).
2. Select **Open** and choose the `intelli_android` folder.
3. Allow Gradle to sync dependencies (uses Gradle 8.11.1 and JDK 17).
4. Select a virtual device (e.g., Pixel 8/9/10 running API 26+) or a physical device.
5. Click **Run 'app'** (`Shift + F10`).

### From Command Line

```bash
# Build the debug APK
./gradlew assembleDebug

# Install on a connected emulator/device
./gradlew installDebug

# Or manually via adb
adb install -r app/build/outputs/apk/debug/app-debug.apk
adb shell am start -n com.example.courseapp/.MainActivity
```

---

##  Assumptions & Scope

- **Mock Authentication**: Simulates credentials check and a short delay (`delay(1000)`). To simulate auth failure, enter an email containing `"fail"` (e.g. `fail@example.com`).
- **Mock Course API**: Simulated network latency (`delay(800)`) with predefined courses and lessons matching specifications.
- **Offline Simulation**: An interactive chip in the top app bar allows toggling offline/online mode on demand to test the offline caching flow.
- **No Background Sync**: As specified, no complex remote synchronization engine or server writeback is implemented; changes persist locally in Room.

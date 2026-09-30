# Mobile Coding Challenge — Dual Framework Implementation

Following up on the mobile coding challenge, I noticed that while the job description highlights experience with **React Native / Flutter**, the assignment prompt specifically suggested building the application using **Kotlin / Jetpack Compose** or **Swift / SwiftUI**.

Since my core strength and deep domain expertise lie in **React Native**, I wanted to showcase my highest standard of engineering, state management, and architecture. At the same time, to respect the technical guidelines of the prompt and demonstrate versatility with modern development tooling, **I have developed and delivered complete implementations in both frameworks:**

1. **[React Native (Primary Domain)](intelli_react_native/README.md)**: Built with Bare React Native, TypeScript, React Context + Custom Hooks, native C++/JSI SQLite (`op-sqlite`), and NetInfo real-time connectivity. I am fully prepared to discuss every design trade-off, architectural pattern, and optimization in depth.
2. **[Android Native (Kotlin & Jetpack Compose)](intelli_android/README.md)**: Built adhering to modern Android best practices, MVVM architecture, Room Database, StateFlow, and Coroutines (implemented with the assistance of modern AI engineering tools).

Both applications follow strict offline-first architecture, identical feature parity, input validation with toast alerts, safe area handling, and native database caching. Comprehensive architectural breakdowns, dependency manifests, and test instructions are documented in the respective project folders' README files:
- [React Native Project README](intelli_react_native/README.md)
- [Android Native Project README](intelli_android/README.md)

---

### Deliverables & Links

#### 1. Repository
- **GitHub Repository**: [laxmanhalaki/Intellipaat_interview](https://github.com/laxmanhalaki/Intellipaat_interview)

#### 2. Installable Release APKs & Video Walkthrough
All assets (APKs and video demonstration) are hosted in the common Google Drive folder:
- 🔗 **[Access Google Drive Deliverables Folder](https://drive.google.com/drive/folders/1k170TgQNuwWMu47_ChfwTO6u0LYPDL2y?usp=sharing)**

Inside the folder you will find:
- **React Native Release APK**: *(Identifiable by the app icon with an orange background and white "RN")*
- **Kotlin / Jetpack Compose Release APK**: *(Identifiable by the app icon with "A" / Compose branding)*
- **Video Walkthrough**: *(Demonstrates login validation, live vs. offline cached states, lesson breakdown, and hardware safe-area compliance on an Android device)*

---

### Key Engineering Highlights (Both Approaches)
- **Offline-First Resilience**: Automatic SQLite/Room local caching fallback when network connectivity is lost.
- **Real-Time Connectivity Indicators**: Live inline status pill badges with an interactive simulation toggle and refresh controls.
- **Robust Input Validation & Feedback**: Email regex format verification and password criteria backed by instant toast notifications.
- **Safe Area & Hardware Cutout Compatibility**: Edge-to-edge layout calibrated for modern display cutouts and status bars.
- **Comprehensive Unit Testing**: High-coverage test suites verifying validation logic, repositories, and error normalization.

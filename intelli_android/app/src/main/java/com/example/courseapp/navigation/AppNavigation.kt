package com.example.courseapp.navigation

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.example.courseapp.presentation.dashboard.DashboardScreen
import com.example.courseapp.presentation.details.CourseDetailsScreen
import com.example.courseapp.presentation.login.LoginScreen

sealed class Screen(val route: String) {
    data object Login : Screen("login")
    data object Dashboard : Screen("dashboard")
    data object CourseDetails : Screen("course/{courseId}") {
        fun createRoute(courseId: Int): String = "course/$courseId"
    }
}

@Composable
fun AppNavigation(
    modifier: Modifier = Modifier,
    navController: NavHostController = rememberNavController()
) {
    NavHost(
        navController = navController,
        startDestination = Screen.Login.route,
        modifier = modifier
    ) {
        composable(Screen.Login.route) {
            LoginScreen(
                onLoginSuccess = {
                    navController.navigate(Screen.Dashboard.route) {
                        popUpTo(Screen.Login.route) {
                            inclusive = true
                        }
                    }
                }
            )
        }

        composable(Screen.Dashboard.route) {
            DashboardScreen(
                onCourseClick = { courseId ->
                    navController.navigate(Screen.CourseDetails.createRoute(courseId))
                }
            )
        }

        composable(
            route = Screen.CourseDetails.route,
            arguments = listOf(
                navArgument("courseId") {
                    type = NavType.IntType
                }
            )
        ) {
            CourseDetailsScreen(
                onBackClick = {
                    navController.popBackStack()
                }
            )
        }
    }
}

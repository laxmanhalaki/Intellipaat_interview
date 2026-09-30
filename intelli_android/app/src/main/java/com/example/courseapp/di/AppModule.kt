package com.example.courseapp.di

import android.content.Context
import androidx.room.Room
import com.example.courseapp.data.local.AppDatabase
import com.example.courseapp.data.local.CourseDao
import com.example.courseapp.data.remote.CourseApi
import com.example.courseapp.data.remote.MockCourseApi
import com.example.courseapp.data.repository.AuthRepositoryImpl
import com.example.courseapp.data.repository.CourseRepositoryImpl
import com.example.courseapp.domain.repository.AuthRepository
import com.example.courseapp.domain.repository.CourseRepository
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AppModule {

    @Provides
    @Singleton
    fun provideAppDatabase(@ApplicationContext context: Context): AppDatabase {
        return Room.databaseBuilder(
            context,
            AppDatabase::class.java,
            "course_app.db"
        ).fallbackToDestructiveMigration().build()
    }

    @Provides
    @Singleton
    fun provideCourseDao(database: AppDatabase): CourseDao {
        return database.courseDao()
    }

    @Provides
    @Singleton
    fun provideMockCourseApi(): MockCourseApi {
        return MockCourseApi()
    }

    @Provides
    @Singleton
    fun provideCourseApi(mockCourseApi: MockCourseApi): CourseApi {
        return mockCourseApi
    }

    @Provides
    @Singleton
    fun provideConnectivityObserver(@ApplicationContext context: Context): com.example.courseapp.util.ConnectivityObserver {
        return com.example.courseapp.util.NetworkConnectivityObserver(context)
    }

    @Provides
    @Singleton
    fun provideCourseRepository(
        courseApi: CourseApi,
        courseDao: CourseDao,
        connectivityObserver: com.example.courseapp.util.ConnectivityObserver
    ): CourseRepository {
        return CourseRepositoryImpl(courseApi, courseDao, connectivityObserver)
    }

    @Provides
    @Singleton
    fun provideAuthRepository(): AuthRepository {
        return AuthRepositoryImpl()
    }
}

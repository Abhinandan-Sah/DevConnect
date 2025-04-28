pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS = credentials('dockerhub-creds')
        GITHUB_CREDENTIALS = credentials('github-creds')
        ENV_FILE = credentials('envfile')
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/Abhinandan-Sah/DevConnect', 
                    branch: 'main',
                    credentialsId: 'github-creds'
            }
        }

        stage('Setup Environment') {
            steps {
                script {
                    dir('server') {
                        bat 'copy /Y "%ENV_FILE%" .env'
                    }
                }
            }
        }

        stage('Build and Push Images') {
            steps {
                script {
                    // Simplified Docker login
                    bat 'echo %DOCKER_CREDENTIALS_PSW%| docker login -u %DOCKER_CREDENTIALS_USR% --password-stdin'
                    
                    // Build and push client image
                    dir('client') {
                        bat """
                            docker build --no-cache=false --pull=true -t %DOCKER_CREDENTIALS_USR%/devconnect:client .
                            docker push %DOCKER_CREDENTIALS_USR%/devconnect:client
                        """
                    }
                    
                    // Build and push server image
                    dir('server') {
                        bat """
                            docker build --no-cache=false --pull=true -t %DOCKER_CREDENTIALS_USR%/devconnect:server .
                            docker push %DOCKER_CREDENTIALS_USR%/devconnect:server
                        """
                    }
                }
            }
        }

        stage('Verify Images') {
            steps {
                script {
                    bat """
                        docker images | findstr "devconnect"
                        echo "Verifying images are pushed to Docker Hub..."
                        docker pull %DOCKER_CREDENTIALS_USR%/devconnect:client
                        docker pull %DOCKER_CREDENTIALS_USR%/devconnect:server
                    """
                }
            }
        }
    }

    post {
        always {
            script {
                bat 'docker logout'
                cleanWs()
            }
        }
        success {
            echo 'Pipeline succeeded! Images have been built and pushed to Docker Hub.'
        }
        failure {
            echo 'Pipeline failed! Check the logs for errors.'
        }
    }
}

// pipeline {
//     agent any

//     environment {
//         DOCKER_CREDENTIALS = credentials('dockerhub-creds')
//         GITHUB_CREDENTIALS = credentials('github-creds')
//         ENV_FILE = credentials('envfile')
//     }

//     stages {
//         stage('Checkout') {
//             steps {
//                 git url: 'https://github.com/Abhinandan-Sah/DevConnect', 
//                     branch: 'main',
//                     credentialsId: 'github-creds'
//             }
//         }

//         stage('Setup Environment') {
//             steps {
//                 script {
//                     dir('server') {
//                         bat 'copy /Y "%ENV_FILE%" .env'
//                     }
//                 }
//             }
//         }

//         stage('Build and Push Client Image') {
//             when {
//                 changeset "**/client/**"
//             }
//             steps {
//                 script {
//                     // Docker login
//                     bat 'echo %DOCKER_CREDENTIALS_PSW%| docker login -u %DOCKER_CREDENTIALS_USR% --password-stdin'
                    
//                     // Build and push client image
//                     dir('client') {
//                         bat """
//                             docker build --no-cache=false --pull=true -t %DOCKER_CREDENTIALS_USR%/devconnect:client .
//                             docker push %DOCKER_CREDENTIALS_USR%/devconnect:client
//                         """
//                     }
//                 }
//             }
//         }

//         stage('Build and Push Server Image') {
//             when {
//                 changeset "**/server/**"
//             }
//             steps {
//                 script {
//                     // Docker login (login happens here too if not already logged in)
//                     bat 'echo %DOCKER_CREDENTIALS_PSW%| docker login -u %DOCKER_CREDENTIALS_USR% --password-stdin'
                    
//                     // Build and push server image using the optimized Dockerfile
//                     dir('server') {
//                         bat """
//                             docker build --no-cache=false --pull=true -t %DOCKER_CREDENTIALS_USR%/devconnect:server .
//                             docker push %DOCKER_CREDENTIALS_USR%/devconnect:server
//                         """
//                     }
//                 }
//             }
//         }

//         stage('Verify Images') {
//             steps {
//                 script {
//                     bat """
//                         docker images | findstr "devconnect"
//                         echo "Verifying images are pushed to Docker Hub..."
//                         docker pull %DOCKER_CREDENTIALS_USR%/devconnect:client
//                         docker pull %DOCKER_CREDENTIALS_USR%/devconnect:server
//                     """
//                 }
//             }
//         }
//     }

//     post {
//         always {
//             script {
//                 bat 'docker logout'
//                 cleanWs()
//             }
//         }
//         success {
//             echo 'Pipeline succeeded! Images have been built and pushed to Docker Hub.'
//         }
//         failure {
//             echo 'Pipeline failed! Check the logs for errors.'
//         }
//     }
// }
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
                        sh 'cp -f "$ENV_FILE" .env'
                    }
                }
            }
        }

        stage('Build and Push Images') {
            steps {
                script {
                    // Docker login
                    sh 'echo "$DOCKER_CREDENTIALS_PSW" | docker login -u "$DOCKER_CREDENTIALS_USR" --password-stdin'
                    
                    // Build and push client image
                    dir('client') {
                        sh '''
                            docker build --no-cache=false --pull=true -t $DOCKER_CREDENTIALS_USR/devconnect:client .
                            docker push $DOCKER_CREDENTIALS_USR/devconnect:client
                        '''
                    }
                    
                    // Build and push server image
                    dir('server') {
                        sh '''
                            docker build --no-cache=false --pull=true -t $DOCKER_CREDENTIALS_USR/devconnect:server .
                            docker push $DOCKER_CREDENTIALS_USR/devconnect:server
                        '''
                    }
                }
            }
        }

        stage('Verify Images') {
            steps {
                script {
                    sh '''
                        docker images | grep "devconnect"
                        echo "Verifying images are pushed to Docker Hub..."
                        docker pull $DOCKER_CREDENTIALS_USR/devconnect:client
                        docker pull $DOCKER_CREDENTIALS_USR/devconnect:server
                    '''
                }
            }
        }

        
    }

    post {
        always {
            script {
                sh 'docker logout'
                cleanWs()
            }
        }
        success {
            echo 'Pipeline succeeded! Images have been built, pushed, and deployed to AWS.'
        }
        failure {
            echo 'Pipeline failed! Check the logs for errors.'
        }
    }
}



// This is a Jenkins pipeline script for aws ec2 for building and pushing Docker images for a project.
// pipeline {
//     agent any

//     environment {
//         DOCKER_CREDENTIALS = credentials('dockerhub-creds')
//         GITHUB_CREDENTIALS = credentials('github-creds')
//         ENV_FILE = credentials('envfile')
//         EC2_HOST = 'ubuntu@3.110.135.86'
//         SSH_KEY = credentials('aws-ssh-key')
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
//                 dir('server') {
//                     sh 'cp -f "$ENV_FILE" .env'
//                 }
//             }
//         }

//         stage('Build and Push Images') {
//             steps {
//                 sh 'echo "$DOCKER_CREDENTIALS_PSW" | docker login -u "$DOCKER_CREDENTIALS_USR" --password-stdin'

//                 dir('client') {
//                     sh '''
//                         docker build --no-cache=false --pull=true -t $DOCKER_CREDENTIALS_USR/devconnect:client .
//                         docker push $DOCKER_CREDENTIALS_USR/devconnect:client
//                     '''
//                 }

//                 dir('server') {
//                     sh '''
//                         docker build --no-cache=false --pull=true -t $DOCKER_CREDENTIALS_USR/devconnect:server .
//                         docker push $DOCKER_CREDENTIALS_USR/devconnect:server
//                     '''
//                 }
//             }
//         }

//         stage('Deploy to AWS') {
//             steps {
//                 sh '''
//                     ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no $EC2_HOST "mkdir -p /home/ubuntu/server"
//                     scp -i "$SSH_KEY" -o StrictHostKeyChecking=no docker-compose.yaml $EC2_HOST:/home/ubuntu/
//                     scp -i "$SSH_KEY" -o StrictHostKeyChecking=no server/.env $EC2_HOST:/home/ubuntu/server/
                    
//                     ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no $EC2_HOST << EOF
//                     cd /home/ubuntu
//                     docker login -u "$DOCKER_CREDENTIALS_USR" -p "$DOCKER_CREDENTIALS_PSW"
//                     docker-compose pull
//                     docker-compose down || true
//                     docker-compose up -d
//                     docker logout
//                     EOF
//                 '''
//             }
//         }
//     }

//     post {
//         always {
//             sh 'docker logout'
//             cleanWs()
//         }
//         success {
//             echo 'Pipeline succeeded! Images have been built, pushed, and deployed to AWS.'
//         }
//         failure {
//             echo 'Pipeline failed! Check the logs for errors.'
//         }
//     }
// }




// pipeline {
//     agent any

//     environment {
//         DOCKER_CREDENTIALS = credentials('dockerhub-creds')
//         GITHUB_CREDENTIALS = credentials('github-creds')
//         ENV_FILE = credentials('envfile')
//         // EC2 instance details using Ubuntu's default user 'ubuntu' if applicable; adjust if needed.
//         // If your instance is still Amazon Linux then 'ec2-user' may be valid.
//         EC2_HOST = 'ubuntu@13.235.71.230'  
//         SSH_KEY = credentials('aws-ssh-key')
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
//                         // On Ubuntu, use 'cp' instead of Windows copy command.
//                         sh 'cp -f "$ENV_FILE" .env'
//                     }
//                 }
//             }
//         }

//         stage('Build and Push Images') {
//             steps {
//                 script {
//                     // Docker login via shell command.
//                     sh 'echo "$DOCKER_CREDENTIALS_PSW" | docker login -u "$DOCKER_CREDENTIALS_USR" --password-stdin'
                    
//                     // Build and push client image.
//                     dir('client') {
//                         sh '''
//                             docker build --no-cache=false --pull=true -t $DOCKER_CREDENTIALS_USR/devconnect:client .
//                             docker push $DOCKER_CREDENTIALS_USR/devconnect:client
//                         '''
//                     }
                    
//                     // Build and push server image.
//                     dir('server') {
//                         sh '''
//                             docker build --no-cache=false --pull=true -t $DOCKER_CREDENTIALS_USR/devconnect:server .
//                             docker push $DOCKER_CREDENTIALS_USR/devconnect:server
//                         '''
//                     }
//                 }
//             }
//         }

//         stage('Verify Images') {
//             steps {
//                 script {
//                     sh '''
//                         docker images | grep "devconnect"
//                         echo "Verifying images are pushed to Docker Hub..."
//                         docker pull $DOCKER_CREDENTIALS_USR/devconnect:client
//                         docker pull $DOCKER_CREDENTIALS_USR/devconnect:server
//                     '''
//                 }
//             }
//         }
        
//         stage('Deploy to AWS') {
//             steps {
//                 script {
//                     // Copy docker-compose file and .env (for server) to the EC2 instance.
//                     sh '''
//                         scp -i "$SSH_KEY" -o StrictHostKeyChecking=no docker-compose.yaml $EC2_HOST:/home/ubuntu/
//                         scp -i "$SSH_KEY" -o StrictHostKeyChecking=no server/.env $EC2_HOST:/home/ubuntu/server/
//                     '''
                    
//                     // SSH into the EC2 instance and deploy via Docker Compose.
//                     sh '''
//                         ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no $EC2_HOST "cd /home/ubuntu && docker login -u $DOCKER_CREDENTIALS_USR -p $DOCKER_CREDENTIALS_PSW && docker-compose pull && docker-compose down || true && docker-compose up -d && docker logout"
//                     '''
//                 }
//             }
//         }
//     }

//     post {
//         always {
//             script {
//                 sh 'docker logout'
//                 cleanWs()
//             }
//         }
//         success {
//             echo 'Pipeline succeeded! Images have been built, pushed, and deployed to AWS.'
//         }
//         failure {
//             echo 'Pipeline failed! Check the logs for errors.'
//         }
//     }
// }

// This is for window docker localhost of jenkins
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

//         stage('Build and Push Images') {
//             steps {
//                 script {
//                     // Simplified Docker login
//                     bat 'echo %DOCKER_CREDENTIALS_PSW%| docker login -u %DOCKER_CREDENTIALS_USR% --password-stdin'
                    
//                     // Build and push client image
//                     dir('client') {
//                         bat """
//                             docker build --no-cache=false --pull=true -t %DOCKER_CREDENTIALS_USR%/devconnect:client .
//                             docker push %DOCKER_CREDENTIALS_USR%/devconnect:client
//                         """
//                     }
                    
//                     // Build and push server image
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
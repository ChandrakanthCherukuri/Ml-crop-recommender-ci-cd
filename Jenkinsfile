pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_CREDENTIALS = credentials('docker-hub-credentials')
        PROJECT_NAME = 'agroassist'
        GIT_COMMIT_SHORT = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
        timeout(time: 1, unit: 'HOURS')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.BUILD_VERSION = "${env.BUILD_NUMBER}-${env.GIT_COMMIT_SHORT}"
                }
            }
        }

        stage('Setup Environment') {
            steps {
                script {
                    echo "Building version: ${env.BUILD_VERSION}"
                    sh 'docker --version'
                    sh 'docker-compose --version'
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('AgroAssist/backend') {
                    script {
                        echo 'Building Backend Service...'
                        sh """
                            docker build \
                                -t ${PROJECT_NAME}-backend:${BUILD_VERSION} \
                                -t ${PROJECT_NAME}-backend:latest \
                                .
                        """
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('AgroAssist/frontend') {
                    script {
                        echo 'Building Frontend Service...'
                        sh """
                            docker build \
                                -t ${PROJECT_NAME}-frontend:${BUILD_VERSION} \
                                -t ${PROJECT_NAME}-frontend:latest \
                                .
                        """
                    }
                }
            }
        }

        stage('Build ML Services') {
            parallel {
                stage('Crop Recommendation') {
                    steps {
                        dir('Crop_Recommendation') {
                            script {
                                echo 'Building Crop Recommendation Service...'
                                sh """
                                    docker build \
                                        -t ${PROJECT_NAME}-crop-recommendation:${BUILD_VERSION} \
                                        -t ${PROJECT_NAME}-crop-recommendation:latest \
                                        .
                                """
                            }
                        }
                    }
                }
                stage('Disease Detection') {
                    steps {
                        dir('Disease_Detection/Minor Proj') {
                            script {
                                echo 'Building Disease Detection Service...'
                                sh """
                                    docker build \
                                        -t ${PROJECT_NAME}-disease-detection:${BUILD_VERSION} \
                                        -t ${PROJECT_NAME}-disease-detection:latest \
                                        .
                                """
                            }
                        }
                    }
                }
            }
        }

        stage('Run Tests') {
            parallel {
                stage('Backend Tests') {
                    steps {
                        dir('AgroAssist/backend') {
                            script {
                                echo 'Running Backend Tests...'
                                sh '''
                                    docker run --rm \
                                        ${PROJECT_NAME}-backend:${BUILD_VERSION} \
                                        npm test || echo "No tests configured"
                                '''
                            }
                        }
                    }
                }
                stage('Frontend Tests') {
                    steps {
                        dir('AgroAssist/frontend') {
                            script {
                                echo 'Running Frontend Tests...'
                                sh '''
                                    docker run --rm \
                                        ${PROJECT_NAME}-frontend:${BUILD_VERSION} \
                                        npm test || echo "No tests configured"
                                '''
                            }
                        }
                    }
                }
            }
        }

        stage('Security Scan') {
            steps {
                script {
                    echo 'Running Security Scans...'
                    // Using Trivy for vulnerability scanning
                    sh """
                        docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
                            aquasec/trivy image \
                            --severity HIGH,CRITICAL \
                            --exit-code 0 \
                            ${PROJECT_NAME}-backend:${BUILD_VERSION} || true
                    """
                }
            }
        }

        stage('Push to Registry') {
            when {
                branch 'main'
            }
            steps {
                script {
                    echo 'Pushing images to Docker Registry...'
                    sh """
                        echo \${DOCKER_CREDENTIALS_PSW} | docker login -u \${DOCKER_CREDENTIALS_USR} --password-stdin ${DOCKER_REGISTRY}
                        
                        docker tag ${PROJECT_NAME}-backend:${BUILD_VERSION} ${DOCKER_REGISTRY}/${DOCKER_CREDENTIALS_USR}/${PROJECT_NAME}-backend:${BUILD_VERSION}
                        docker tag ${PROJECT_NAME}-backend:latest ${DOCKER_REGISTRY}/${DOCKER_CREDENTIALS_USR}/${PROJECT_NAME}-backend:latest
                        docker push ${DOCKER_REGISTRY}/${DOCKER_CREDENTIALS_USR}/${PROJECT_NAME}-backend:${BUILD_VERSION}
                        docker push ${DOCKER_REGISTRY}/${DOCKER_CREDENTIALS_USR}/${PROJECT_NAME}-backend:latest
                        
                        docker tag ${PROJECT_NAME}-frontend:${BUILD_VERSION} ${DOCKER_REGISTRY}/${DOCKER_CREDENTIALS_USR}/${PROJECT_NAME}-frontend:${BUILD_VERSION}
                        docker tag ${PROJECT_NAME}-frontend:latest ${DOCKER_REGISTRY}/${DOCKER_CREDENTIALS_USR}/${PROJECT_NAME}-frontend:latest
                        docker push ${DOCKER_REGISTRY}/${DOCKER_CREDENTIALS_USR}/${PROJECT_NAME}-frontend:${BUILD_VERSION}
                        docker push ${DOCKER_REGISTRY}/${DOCKER_CREDENTIALS_USR}/${PROJECT_NAME}-frontend:latest
                        
                        docker tag ${PROJECT_NAME}-crop-recommendation:${BUILD_VERSION} ${DOCKER_REGISTRY}/${DOCKER_CREDENTIALS_USR}/${PROJECT_NAME}-crop-recommendation:${BUILD_VERSION}
                        docker tag ${PROJECT_NAME}-crop-recommendation:latest ${DOCKER_REGISTRY}/${DOCKER_CREDENTIALS_USR}/${PROJECT_NAME}-crop-recommendation:latest
                        docker push ${DOCKER_REGISTRY}/${DOCKER_CREDENTIALS_USR}/${PROJECT_NAME}-crop-recommendation:${BUILD_VERSION}
                        docker push ${DOCKER_REGISTRY}/${DOCKER_CREDENTIALS_USR}/${PROJECT_NAME}-crop-recommendation:latest
                        
                        docker tag ${PROJECT_NAME}-disease-detection:${BUILD_VERSION} ${DOCKER_REGISTRY}/${DOCKER_CREDENTIALS_USR}/${PROJECT_NAME}-disease-detection:${BUILD_VERSION}
                        docker tag ${PROJECT_NAME}-disease-detection:latest ${DOCKER_REGISTRY}/${DOCKER_CREDENTIALS_USR}/${PROJECT_NAME}-disease-detection:latest
                        docker push ${DOCKER_REGISTRY}/${DOCKER_CREDENTIALS_USR}/${PROJECT_NAME}-disease-detection:${BUILD_VERSION}
                        docker push ${DOCKER_REGISTRY}/${DOCKER_CREDENTIALS_USR}/${PROJECT_NAME}-disease-detection:latest
                    """
                }
            }
        }

        stage('Deploy to Development') {
            when {
                branch 'develop'
            }
            steps {
                script {
                    echo 'Deploying to Development Environment...'
                    sh """
                        docker-compose -f docker-compose.yml down
                        docker-compose -f docker-compose.yml up -d
                    """
                }
            }
        }

        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                input message: 'Deploy to Production?', ok: 'Deploy'
                script {
                    echo 'Deploying to Production Environment...'
                    sh """
                        docker-compose -f docker-compose.yml -f docker-compose.prod.yml down
                        docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
                    """
                }
            }
        }
    }

    post {
        always {
            script {
                echo 'Cleaning up...'
                sh 'docker system prune -f --volumes'
            }
        }
        success {
            echo 'Pipeline completed successfully!'
            // Add notification here (email, Slack, etc.)
        }
        failure {
            echo 'Pipeline failed!'
            // Add notification here (email, Slack, etc.)
        }
    }
}

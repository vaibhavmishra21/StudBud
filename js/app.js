// Main Application Controller
class StudyHubApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.init();
    }
    
    init() {
        this.setupNavigation();
        this.loadDashboard();
        this.loadAnalytics();
        this.loadNotes();
        this.loadVideos();
        this.loadQuiz();
        this.initializeTimer();
    }
    
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                this.navigateToPage(page);
                
                // Update active nav link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }
    
    navigateToPage(page) {
        // Hide all content sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show selected page
        const targetSection = document.getElementById(`${page}Content`);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentPage = page;
            
            // Initialize page-specific content
            this.initializePage(page);
        }
    }
    
    initializePage(page) {
        switch (page) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'analytics':
                this.loadAnalytics();
                break;
            case 'timer':
                this.initializeTimer();
                break;
        }
    }
    
    loadDashboard() {
        this.updateStats();
        this.loadRecentActivity();
        
        // Create charts
        setTimeout(() => {
            chartManager.createWeeklyProgressChart();
            chartManager.createSubjectChart();
        }, 100);
    }
    
    loadAnalytics() {
        this.updateDetailedStats();
        this.loadSubjectProgress();
        
        // Create analytics charts
        setTimeout(() => {
            chartManager.createDailyStudyChart();
            chartManager.createChapterProgressChart();
            chartManager.createConceptMasteryChart();
            chartManager.createLearningVelocityChart();
        }, 100);
    }
    
    updateStats() {
        document.getElementById('totalStudyTime').textContent = mockData.stats.totalStudyTime;
        document.getElementById('chaptersCompleted').textContent = mockData.stats.chaptersCompleted;
        document.getElementById('lessonsCompleted').textContent = mockData.stats.lessonsCompleted;
        document.getElementById('conceptsLearned').textContent = mockData.stats.conceptsLearned;
    }
    
    updateDetailedStats() {
        const totalMinutes = mockData.stats.totalStudyTime * 60;
        document.getElementById('detailedStudyTime').textContent = dataUtils.formatTime(totalMinutes);
        document.getElementById('avgSessionLength').textContent = '45m';
        document.getElementById('studyStreak').textContent = `${mockData.stats.currentStreak} days`;
    }
    
    loadRecentActivity() {
        const activityContainer = document.getElementById('recentActivity');
        if (!activityContainer) return;
        
        activityContainer.innerHTML = '';
        
        mockData.recentActivity.forEach(activity => {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item fade-in';
            activityItem.innerHTML = `
                <div class="activity-icon" style="background-color: ${activity.color}20; color: ${activity.color}">
                    ${activity.icon}
                </div>
                <div class="activity-info">
                    <h4>${activity.title}</h4>
                    <p>${activity.subject} • ${activity.time}</p>
                </div>
            `;
            activityContainer.appendChild(activityItem);
        });
    }
    
    loadSubjectProgress() {
        const progressContainer = document.getElementById('subjectProgress');
        if (!progressContainer) return;
        
        progressContainer.innerHTML = '';
        
        mockData.subjectProgress.forEach(subject => {
            const subjectItem = document.createElement('div');
            subjectItem.className = 'subject-item fade-in';
            subjectItem.innerHTML = `
                <div class="subject-header">
                    <span class="subject-name">${subject.name}</span>
                    <span class="subject-percentage">${subject.percentage}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${subject.percentage}%"></div>
                </div>
                <div class="subject-details">
                    <span>Chapters: ${subject.chapters.completed}/${subject.chapters.total}</span>
                    <span>Lessons: ${subject.lessons.completed}/${subject.lessons.total}</span>
                    <span>Concepts: ${subject.concepts.completed}/${subject.concepts.total}</span>
                </div>
            `;
            progressContainer.appendChild(subjectItem);
        });
    }
    
    loadNotes() {
        const notesGrid = document.getElementById('notesGrid');
        if (!notesGrid) return;
        
        notesGrid.innerHTML = '';
        
        mockData.notes.forEach(note => {
            const noteCard = document.createElement('div');
            noteCard.className = 'note-card fade-in';
            noteCard.innerHTML = `
                <div class="note-content">
                    <h3 class="note-title">${note.title}</h3>
                    <p class="note-subject">${note.subject}</p>
                    <p class="note-description">${note.description}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <span style="font-size: 0.875rem; color: var(--text-secondary);">${note.pages} pages</span>
                        <span style="font-size: 0.875rem; color: var(--text-secondary);">Updated ${note.lastModified}</span>
                    </div>
                    <button class="btn-primary" onclick="app.openNote(${note.id})">Read Now</button>
                </div>
            `;
            notesGrid.appendChild(noteCard);
        });
    }
    
    loadVideos() {
        const videosGrid = document.getElementById('videosGrid');
        if (!videosGrid) return;
        
        videosGrid.innerHTML = '';
        
        mockData.videos.forEach(video => {
            const videoCard = document.createElement('div');
            videoCard.className = 'video-card fade-in';
            videoCard.innerHTML = `
                <div class="video-content">
                    <h3 class="video-title">${video.title}</h3>
                    <p class="video-subject">${video.subject}</p>
                    <p class="video-description">${video.description}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <span style="font-size: 0.875rem; color: var(--text-secondary);">${video.duration}</span>
                        <span style="font-size: 0.875rem; color: var(--text-secondary);">by ${video.instructor}</span>
                    </div>
                    <button class="btn-primary" onclick="app.playVideo(${video.id})">Watch Now</button>
                </div>
            `;
            videosGrid.appendChild(videoCard);
        });
    }
    
    loadQuiz() {
        const quizContainer = document.getElementById('quizContainer');
        if (!quizContainer) return;
        
        quizContainer.innerHTML = `
            <div class="quiz-selection">
                <h3>Available Quizzes</h3>
                <div class="quiz-grid">
                    <div class="quiz-card">
                        <h4>Mathematics Quiz</h4>
                        <p>Test your calculus knowledge</p>
                        <button class="btn-primary" onclick="app.startQuiz('math')">Start Quiz</button>
                    </div>
                    <div class="quiz-card">
                        <h4>Physics Quiz</h4>
                        <p>Quantum mechanics fundamentals</p>
                        <button class="btn-primary" onclick="app.startQuiz('physics')">Start Quiz</button>
                    </div>
                    <div class="quiz-card">
                        <h4>Chemistry Quiz</h4>
                        <p>Organic chemistry reactions</p>
                        <button class="btn-primary" onclick="app.startQuiz('chemistry')">Start Quiz</button>
                    </div>
                    <div class="quiz-card">
                        <h4>Biology Quiz</h4>
                        <p>Cell biology and genetics</p>
                        <button class="btn-primary" onclick="app.startQuiz('biology')">Start Quiz</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add quiz styles
        const style = document.createElement('style');
        style.textContent = `
            .quiz-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 1.5rem;
                margin-top: 1.5rem;
            }
            .quiz-card {
                background: var(--surface-color);
                padding: 2rem;
                border-radius: var(--border-radius);
                box-shadow: var(--shadow);
                text-align: center;
                transition: var(--transition);
            }
            .quiz-card:hover {
                transform: translateY(-2px);
                box-shadow: var(--shadow-lg);
            }
            .quiz-card h4 {
                margin-bottom: 1rem;
                color: var(--text-primary);
            }
            .quiz-card p {
                color: var(--text-secondary);
                margin-bottom: 1.5rem;
            }
        `;
        document.head.appendChild(style);
    }
    
    initializeTimer() {
        if (!window.timerManager) {
            window.timerManager = new TimerManager();
        }
    }
    
    // Action methods
    openNote(noteId) {
        const note = mockData.notes.find(n => n.id === noteId);
        if (note) {
            this.showNotification(`Opening "${note.title}"`);
            // In a real app, this would open the note viewer
        }
    }
    
    playVideo(videoId) {
        const video = mockData.videos.find(v => v.id === videoId);
        if (video) {
            this.showNotification(`Playing "${video.title}"`);
            // In a real app, this would open the video player
        }
    }
    
    startQuiz(subject) {
        this.showNotification(`Starting ${subject} quiz...`);
        // In a real app, this would start the quiz interface
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'app-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--primary-color);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new StudyHubApp();
});
// Custom Chart Implementation using Canvas and SVG
class CustomChartManager {
    constructor() {
        this.charts = {};
        this.colors = {
            primary: '#3b82f6',
            secondary: '#10b981',
            tertiary: '#f59e0b',
            quaternary: '#ef4444',
            success: '#22c55e',
            warning: '#eab308',
            error: '#dc2626'
        };
    }
    
    // Create Weekly Progress Line Chart
    createWeeklyProgressChart() {
        const canvas = document.getElementById('weeklyProgressChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const data = mockData.weeklyProgress;
        
        // Set canvas size
        canvas.width = 400;
        canvas.height = 200;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Chart dimensions
        const padding = 40;
        const chartWidth = canvas.width - (padding * 2);
        const chartHeight = canvas.height - (padding * 2);
        
        // Find max value for scaling
        const maxValue = Math.max(...data.map(d => d.hours));
        const scale = chartHeight / (maxValue * 1.2);
        
        // Draw grid lines
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        
        // Horizontal grid lines
        for (let i = 0; i <= 5; i++) {
            const y = padding + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(padding + chartWidth, y);
            ctx.stroke();
        }
        
        // Draw line chart
        ctx.strokeStyle = this.colors.primary;
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        data.forEach((point, index) => {
            const x = padding + (chartWidth / (data.length - 1)) * index;
            const y = padding + chartHeight - (point.hours * scale);
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Draw data points
        ctx.fillStyle = this.colors.primary;
        data.forEach((point, index) => {
            const x = padding + (chartWidth / (data.length - 1)) * index;
            const y = padding + chartHeight - (point.hours * scale);
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        });
        
        // Draw labels
        ctx.fillStyle = '#6b7280';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        
        data.forEach((point, index) => {
            const x = padding + (chartWidth / (data.length - 1)) * index;
            ctx.fillText(point.day, x, canvas.height - 10);
        });
        
        // Y-axis labels
        ctx.textAlign = 'right';
        for (let i = 0; i <= 5; i++) {
            const value = (maxValue * 1.2 / 5) * (5 - i);
            const y = padding + (chartHeight / 5) * i;
            ctx.fillText(value.toFixed(1), padding - 10, y + 4);
        }
    }
    
    // Create Subject Distribution Doughnut Chart
    createSubjectChart() {
        const canvas = document.getElementById('subjectChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const data = mockData.subjectDistribution;
        
        // Set canvas size
        canvas.width = 300;
        canvas.height = 300;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 80;
        const innerRadius = 40;
        
        // Calculate total and angles
        const total = data.reduce((sum, item) => sum + item.hours, 0);
        let currentAngle = -Math.PI / 2; // Start from top
        
        // Draw segments
        data.forEach((item, index) => {
            const sliceAngle = (item.hours / total) * 2 * Math.PI;
            
            // Draw outer arc
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
            ctx.closePath();
            ctx.fillStyle = item.color;
            ctx.fill();
            
            currentAngle += sliceAngle;
        });
        
        // Draw legend
        const legendY = canvas.height - 80;
        data.forEach((item, index) => {
            const legendX = 20 + (index * 60);
            
            // Legend color box
            ctx.fillStyle = item.color;
            ctx.fillRect(legendX, legendY, 12, 12);
            
            // Legend text
            ctx.fillStyle = '#374151';
            ctx.font = '10px Arial';
            ctx.fillText(item.subject.substring(0, 4), legendX, legendY + 25);
        });
    }
    
    // Create Daily Study Bar Chart
    createDailyStudyChart() {
        const canvas = document.getElementById('dailyStudyChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const data = mockData.dailyStudyTime.slice(-7); // Last 7 days
        
        // Set canvas size
        canvas.width = 400;
        canvas.height = 200;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const padding = 40;
        const chartWidth = canvas.width - (padding * 2);
        const chartHeight = canvas.height - (padding * 2);
        const barWidth = chartWidth / data.length - 10;
        
        // Find max value
        const maxValue = Math.max(...data.map(d => d.time));
        const scale = chartHeight / (maxValue * 1.2);
        
        // Draw bars
        data.forEach((item, index) => {
            const barHeight = item.time * scale;
            const x = padding + (chartWidth / data.length) * index + 5;
            const y = padding + chartHeight - barHeight;
            
            // Draw bar
            ctx.fillStyle = this.colors.primary + '80';
            ctx.fillRect(x, y, barWidth, barHeight);
            
            // Draw bar border
            ctx.strokeStyle = this.colors.primary;
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, barWidth, barHeight);
            
            // Draw label
            ctx.fillStyle = '#6b7280';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            const date = new Date(item.date);
            const label = date.getDate() + '/' + (date.getMonth() + 1);
            ctx.fillText(label, x + barWidth / 2, canvas.height - 10);
        });
    }
    
    // Create Chapter Progress Stacked Bar Chart
    createChapterProgressChart() {
        const canvas = document.getElementById('chapterProgressChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const data = mockData.chapterProgress;
        
        // Set canvas size
        canvas.width = 400;
        canvas.height = 200;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const padding = 40;
        const chartWidth = canvas.width - (padding * 2);
        const chartHeight = canvas.height - (padding * 2);
        const barHeight = 30;
        const barSpacing = 10;
        
        data.forEach((item, index) => {
            const y = padding + (barHeight + barSpacing) * index;
            const completedWidth = (item.completed / item.total) * chartWidth;
            const remainingWidth = ((item.total - item.completed) / item.total) * chartWidth;
            
            // Draw completed portion
            ctx.fillStyle = this.colors.success;
            ctx.fillRect(padding, y, completedWidth, barHeight);
            
            // Draw remaining portion
            ctx.fillStyle = '#e5e7eb';
            ctx.fillRect(padding + completedWidth, y, remainingWidth, barHeight);
            
            // Draw subject label
            ctx.fillStyle = '#374151';
            ctx.font = '12px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(item.subject, padding, y - 5);
            
            // Draw progress text
            ctx.textAlign = 'center';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`${item.completed}/${item.total}`, padding + chartWidth / 2, y + barHeight / 2 + 4);
        });
    }
    
    // Create Concept Mastery Pie Chart
    createConceptMasteryChart() {
        const canvas = document.getElementById('conceptMasteryChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const data = mockData.conceptMastery;
        
        // Set canvas size
        canvas.width = 250;
        canvas.height = 250;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 80;
        
        // Calculate total and angles
        const total = data.reduce((sum, item) => sum + item.count, 0);
        let currentAngle = -Math.PI / 2;
        
        const colors = [this.colors.success, this.colors.warning, this.colors.error];
        
        // Draw segments
        data.forEach((item, index) => {
            const sliceAngle = (item.count / total) * 2 * Math.PI;
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = colors[index];
            ctx.fill();
            
            // Draw percentage text
            const textAngle = currentAngle + sliceAngle / 2;
            const textX = centerX + Math.cos(textAngle) * (radius * 0.7);
            const textY = centerY + Math.sin(textAngle) * (radius * 0.7);
            
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            const percentage = Math.round((item.count / total) * 100);
            ctx.fillText(percentage + '%', textX, textY);
            
            currentAngle += sliceAngle;
        });
        
        // Draw legend
        data.forEach((item, index) => {
            const legendY = canvas.height - 60 + (index * 20);
            
            // Legend color box
            ctx.fillStyle = colors[index];
            ctx.fillRect(10, legendY, 12, 12);
            
            // Legend text
            ctx.fillStyle = '#374151';
            ctx.font = '12px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(item.level, 30, legendY + 10);
        });
    }
    
    // Create Learning Velocity Line Chart
    createLearningVelocityChart() {
        const canvas = document.getElementById('learningVelocityChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const data = mockData.learningVelocity;
        
        // Set canvas size
        canvas.width = 400;
        canvas.height = 200;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const padding = 40;
        const chartWidth = canvas.width - (padding * 2);
        const chartHeight = canvas.height - (padding * 2);
        
        // Find max value
        const maxValue = Math.max(...data.map(d => d.concepts));
        const scale = chartHeight / (maxValue * 1.2);
        
        // Draw area under curve
        ctx.fillStyle = this.colors.secondary + '20';
        ctx.beginPath();
        ctx.moveTo(padding, padding + chartHeight);
        
        data.forEach((point, index) => {
            const x = padding + (chartWidth / (data.length - 1)) * index;
            const y = padding + chartHeight - (point.concepts * scale);
            ctx.lineTo(x, y);
        });
        
        ctx.lineTo(padding + chartWidth, padding + chartHeight);
        ctx.closePath();
        ctx.fill();
        
        // Draw line
        ctx.strokeStyle = this.colors.secondary;
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        data.forEach((point, index) => {
            const x = padding + (chartWidth / (data.length - 1)) * index;
            const y = padding + chartHeight - (point.concepts * scale);
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Draw data points
        ctx.fillStyle = this.colors.secondary;
        data.forEach((point, index) => {
            const x = padding + (chartWidth / (data.length - 1)) * index;
            const y = padding + chartHeight - (point.concepts * scale);
            
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fill();
            
            // White center
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = this.colors.secondary;
        });
        
        // Draw labels
        ctx.fillStyle = '#6b7280';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        
        data.forEach((point, index) => {
            const x = padding + (chartWidth / (data.length - 1)) * index;
            ctx.fillText(point.week, x, canvas.height - 10);
        });
    }
    
    // Update all charts when theme changes
    updateChartsForTheme() {
        // Update colors based on current theme
        const root = document.documentElement;
        this.colors.primary = getComputedStyle(root).getPropertyValue('--primary-color').trim();
        this.colors.secondary = getComputedStyle(root).getPropertyValue('--secondary-color').trim();
        
        // Recreate all charts with new colors
        setTimeout(() => {
            this.createWeeklyProgressChart();
            this.createSubjectChart();
            this.createDailyStudyChart();
            this.createChapterProgressChart();
            this.createConceptMasteryChart();
            this.createLearningVelocityChart();
        }, 100);
    }
}

// Initialize chart manager
const chartManager = new CustomChartManager();
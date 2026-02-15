export class BusinessIntelligence {
    // Mandate: Director of Operations. Tracks "Session Unit Economics".
    // Focus: Cost of running a 1-hour session for 20 students.

    private activeStudents: number = 0;
    private tokenUsage: number = 0;
    private serverLoad: number = 0;

    constructor() { }

    trackSessionMetric(metric: 'student_join' | 'token_gen' | 'server_req', value: number) {
        switch (metric) {
            case 'student_join':
                this.activeStudents += value;
                break;
            case 'token_gen':
                this.tokenUsage += value;
                break;
            case 'server_req':
                this.serverLoad += value;
                break;
        }
    }

    calculateUnitEconomics() {
        // Assumptions:
        // - 1 Student = 1 Active Connection
        // - 1 Hour Session = 60 mins
        // - Infrastructure Cost per hour (Base) = $0.50
        // - Token Cost per 1k tokens = $0.002

        const baseCost = 0.50;
        const tokenCost = (this.tokenUsage / 1000) * 0.002;
        const scalingFactor = Math.max(1, this.activeStudents / 20); // Scale cost if > 20 students
        const videoCost = this.calculateVideoRenderingCost();

        const totalSessionCost = (baseCost * scalingFactor) + tokenCost + videoCost;

        console.log(`[BI REPORT] Active Students: ${this.activeStudents}`);
        console.log(`[BI REPORT] Est. Session Cost (1h): $${totalSessionCost.toFixed(4)}`);
        return totalSessionCost;
    }

    calculateVideoRenderingCost(): number {
        // Video Scale Economics: 20 students * 5 videos * $0.05/min render cost (Assuming 1 min avg length per video for simplicity of calculation per video unit)
        // Adjust formula: 5 videos per student.
        const videosPerStudent = 5;
        const costPerVideo = 0.05; // $0.05 per video render (approx 1 min SD)

        const totalVideos = this.activeStudents * videosPerStudent;
        const totalVideoCost = totalVideos * costPerVideo;

        return totalVideoCost;
    }

    // Legacy method wrapper
    trackCost(resource: string, _cost: number) {
        // Map legacy calls to new metrics if needed usually
        if (resource.includes("Completion")) this.trackSessionMetric('token_gen', 50); // Mock token usage
    }
}

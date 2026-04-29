export const normalizeApplicationDetail = (payload) => {
    if (!payload) return null;

    const info = payload.applicationInfo || {};
    const resume = payload.resumeDetail || {};
    const ai = payload.aiEvaluation || {};

    return {
        applicationId: info.id,
        jobId: info.jobId,
        status: info.status,
        attempt: info.attempt,
        candidateName: info.fullName,
        candidateEmail: info.email,
        candidatePhone: info.phone,
        jobTitle: info.jobTitle,
        coverLetter: info.coverLetter,
        appliedAt: info.appliedAt,
        resumeId: resume.id,
        resumeUrl: resume.resumeUrl,
        resumeName: info.resumeName,
        location: resume.addressInResume,
        githubLink: resume.githubLink,
        linkedinLink: resume.linkedinLink,
        portfolioLink: resume.portfolioLink,
        answers: (info.answers || []).map((answer) => ({
            question: answer.questionText,
            answer: answer.answerContent,
        })),
        aiScore: ai.aiOverallScore,
        recruiterScore: ai.recruiterOverallScore,
        evaluationId: ai.id,
        aiEvaluation: payload.aiEvaluation || null,
        source: payload.source,
        rejectReason: info.rejectReason,
        showRejectReason: info.showRejectReason,
        reviewedAt: info.reviewedAt,
        reviewedByEmail: info.reviewedByEmail,
        isRejectedByAi: info.isRejectedByAi,
        isInTalentPool: !!info.isInTalentPool,
        poolInfo: info.poolInfo || null,
    };
};

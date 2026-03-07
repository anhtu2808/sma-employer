import * as XLSX from 'xlsx';

export const exportCandidates = (data, jobTitle = 'Candidates', type = 'excel') => {
    if (!data || data.length === 0) return;

    const formattedData = data.map((item, index) => ({
        "No.": index + 1,
        "Candidate Name": item.fullName,
        "Email Address": item.email,
        "Phone Number": item.phone,
        "Applied Position": item.jobTitle,
        "AI Score (%)": item.aiScore ? `${item.aiScore}%` : "N/A",
        "Match Level": item.matchLevel || "N/A",
        "Experience (Years)": item.totalExperienceYears,
        "Key Skills": item.topSkills,
        "Applied Date": item.appliedAt,
        "Resume Link": item.resumeUrl,
        "AI Evaluation Summary": item.aiSummary
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates");

    const dateStr = new Date().toISOString().split('T')[0];
    const cleanJobTitle = jobTitle.replace(/[^a-zA-Z0-9]/g, '_');

    if (type === 'csv') {
        XLSX.writeFile(workbook, `${cleanJobTitle}_${dateStr}.csv`, { bookType: 'csv' });
    } else {
        worksheet['!cols'] = [{ wch: 6 }, { wch: 25 }, { wch: 30 }, { wch: 15 }, { wch: 25 }, { wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 40 }, { wch: 20 }, { wch: 45 }, { wch: 60 }];
        XLSX.writeFile(workbook, `${cleanJobTitle}_${dateStr}.xlsx`, { bookType: 'xlsx' });
    }
};
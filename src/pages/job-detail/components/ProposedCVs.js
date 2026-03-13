import React, { useState } from 'react';
import { Table, Progress, Tag } from 'antd';
import dayjs from 'dayjs';

const mockProposedCVsResponse = {
  "code": 0,
  "message": "success",
  "data": {
    "content": [
      {
        "id": 1,
        "jobTitle": "Senior Frontend Developer",
        "matchRate": 95,
        "user": {
          "id": 101,
          "fullName": "Nguyen Van A",
          "email": "nguyenvana@example.com",
          "avatar": "https://i.pravatar.cc/150?u=a042581f4e29026024d",
          "dateOfBirth": "1995-05-12",
          "gender": "MALE"
        }
      },
      {
        "id": 2,
        "jobTitle": "React Native Specialist",
        "matchRate": 88,
        "user": {
          "id": 102,
          "fullName": "Tran Thi B",
          "email": "tranthib.dev@example.com",
          "avatar": "https://i.pravatar.cc/150?u=a042581f4e29026704d",
          "dateOfBirth": "1998-11-23",
          "gender": "FEMALE"
        }
      },
      {
        "id": 3,
        "jobTitle": "UI/UX Developer",
        "matchRate": 74,
        "user": {
          "id": 103,
          "fullName": "Le Thanh C",
          "email": "lethanhc@example.com",
          "avatar": null,
          "dateOfBirth": "1992-02-15",
          "gender": "MALE"
        }
      },
      {
        "id": 4,
        "jobTitle": "Frontend Engineer",
        "matchRate": 65,
        "user": {
          "id": 104,
          "fullName": "Pham Thu D",
          "email": "phamthud@example.com",
          "avatar": "https://i.pravatar.cc/150?u=a04258114e29026702d",
          "dateOfBirth": "2000-08-08",
          "gender": "FEMALE"
        }
      }
    ],
    "pageNumber": 0,
    "pageSize": 10,
    "totalElements": 4,
    "totalPages": 1,
    "first": true,
    "last": true
  }
};

const ProposedCVs = ({ jobId }) => {
  // Simulating data fetch setup. In the future this will be replaced with useGetProposedCvsQuery(jobId)
  const [data] = useState(mockProposedCVsResponse.data);

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    return dayjs().diff(dayjs(dateOfBirth), 'year');
  };

  const columns = [
    {
      title: 'Candidate',
      key: 'candidate',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          {record.user?.avatar ? (
             <img 
               src={record.user.avatar} 
               alt={record.user.fullName} 
               className="w-10 h-10 rounded-full object-cover border border-gray-200"
             />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
               {record.user?.fullName?.charAt(0)?.toUpperCase()}
            </div>
          )}
          
          <div>
            <div className="font-semibold text-gray-900 dark:text-gray-100">
               {record.user?.fullName} 
               <span className="text-gray-400 font-normal ml-2">
                 {calculateAge(record.user?.dateOfBirth)} y/o
               </span>
            </div>
            <div className="text-sm text-gray-500">{record.user?.email}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Job Title',
      dataIndex: 'jobTitle',
      key: 'jobTitle',
      render: (text) => <span className="text-gray-700 dark:text-gray-300 font-medium">{text}</span>
    },
    {
      title: 'Gender',
      dataIndex: ['user', 'gender'],
      key: 'gender',
      render: (gender) => {
         if (gender === 'MALE') return <Tag color="blue">Male</Tag>;
         if (gender === 'FEMALE') return <Tag color="magenta">Female</Tag>;
         return <Tag>Other</Tag>;
      }
    },
    {
      title: 'AI Match Rate',
      dataIndex: 'matchRate',
      key: 'matchRate',
      align: 'center',
      render: (rate) => {
        let strokeColor = '#f5222d'; // Red for low
        if (rate >= 80) strokeColor = '#52c41a'; // Green for high
        else if (rate >= 60) strokeColor = '#faad14'; // Yellow for medium

        return (
          <div className="flex flex-col items-center justify-center">
             <Progress 
                type="dashboard" 
                percent={rate} 
                size={48} 
                strokeColor={strokeColor}
                format={(percent) => (
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    {percent}%
                  </span>
                )}
             />
          </div>
        );
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <button 
          className="text-primary hover:text-primary-dark font-medium transition-colors p-2 hover:bg-orange-50 dark:hover:bg-gray-800 rounded-lg"
          onClick={() => console.log('View profile for', record.user?.id)}
        >
          View Profile
        </button>
      )
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mt-4">
      <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
         <div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">AI Proposed Candidates</h3>
            <p className="text-sm text-gray-500 mt-1">
               Candidates automatically recommended by our AI matching engine based on job requirements.
            </p>
         </div>
         <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2">
            <span className="material-icons-outlined text-sm">auto_awesome</span>
            {data.totalElements} Matches Found
         </div>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={data.content}
        rowKey="id"
        pagination={{
           current: data.pageNumber + 1,
           pageSize: data.pageSize,
           total: data.totalElements,
           showSizeChanger: false,
        }}
        className="w-full"
      />
    </div>
  );
};

export default ProposedCVs;

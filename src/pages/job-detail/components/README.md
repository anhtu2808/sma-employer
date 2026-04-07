# ProposedCVs.js

## Mục đích

`ProposedCVs.js` là component dùng để hiển thị danh sách CV được AI đề xuất cho một job trong trang chi tiết job.

Component hiện được render trong tab:

- `Proposed CVs (${proposedCvCount})` tại `src/pages/job-detail/index.js`

## File liên quan

- Component chính: `src/pages/job-detail/components/ProposedCVs.js`
- API lấy danh sách proposed CVs: `src/apis/jobApi.js`
- Route chi tiết proposed CV: `src/routes/index.js`

## Input hiện tại

Component nhận 1 prop:

- `jobId`: id của job cần lấy danh sách CV đề xuất

## Dữ liệu đang dùng

`ProposedCVs.js` đang gọi 2 API:

1. `useGetJobDetailQuery(jobId)`
   - Dùng để lấy `status` của job
   - Nếu job ở trạng thái `DRAFT` hoặc `PENDING_REVIEW` thì không hiển thị danh sách CV, thay vào đó hiển thị placeholder yêu cầu publish job trước

2. `useGetProposedCvsQuery({ id: jobId, page, size })`
   - Gọi API `GET /jobs/{id}/proposed-cv`
   - Dùng để lấy danh sách CV được đề xuất theo phân trang

State phân trang hiện tại:

- `page: 0`
- `size: 10`

## UI hiện tại đã có

### 1. Trạng thái job chưa publish

Nếu job có status là `DRAFT` hoặc `PENDING_REVIEW`, component hiển thị:

- icon rocket
- tiêu đề `Publish your job first`
- mô tả: AI sẽ đề xuất CV sau khi job được publish

### 2. Header thống kê

Khi job đủ điều kiện hiển thị, phía trên danh sách có phần header:

- icon magic wand
- tổng số CV được đề xuất: `totalElements`
- text hiển thị: `proposed CVs found`

### 3. Loading state

Khi đang fetch danh sách proposed CVs:

- hiển thị component `Loading`

### 4. Empty state

Khi API trả về danh sách rỗng:

- icon `Users`
- text `No proposed CVs yet`
- mô tả `Recommended candidates will appear here.`

### 5. Bảng danh sách CV

Khi có dữ liệu, component render table với các cột:

- `Candidate`
- `Job Title`
- `Gender`
- `AI Match Rate`
- `Action`

Thông tin mỗi dòng hiện đang hiển thị:

- avatar chữ cái đầu từ `fullName`
- tên ứng viên
- địa chỉ từ `address`, nếu không có thì hiện `No address provided`
- job title từ `jobTitle`, nếu không có thì hiện `N/A`
- gender badge:
  - `MALE` -> `Male`
  - `FEMALE` -> `Female`
  - còn lại -> `Other`
- match rate:
  - nếu giá trị nằm trong khoảng `0 < rate <= 1` thì được đổi sang phần trăm
  - nếu lớn hơn `1` thì được làm tròn và hiển thị trực tiếp dạng `%`
  - màu sắc:
    - `>= 80%`: xanh lá
    - `>= 60%`: cam
    - còn lại: đỏ

### 6. Action

Mỗi dòng hiện có 1 nút action:

- icon `ExternalLink`
- điều hướng tới:
  - `/jobs/:jobId/proposed-cvs/:resumeId?proposedResumeId=:proposedResumeId`

Màn này tương ứng với route:

- `jobs/:jobId/proposed-cvs/:resumeId`

### 7. Pagination

Component hiện đã có phân trang cơ bản:

- nút `Previous`
- danh sách số trang theo `totalPages`
- nút `Next`
- dòng thống kê `Showing X of Y Candidates`

## Fallback dữ liệu

Nếu API chưa có dữ liệu trả về, component đang fallback về object mặc định:

- `content: []`
- `totalElements: 0`
- `pageNumber: params.page`
- `pageSize: params.size`
- `totalPages: 0`

Điều này giúp UI không bị lỗi khi response chưa sẵn sàng.

## Helper hiện có trong file

### `getDisplayRate(rate)`

- Chuẩn hóa `matchRate` để hiển thị ra phần trăm
- Hỗ trợ cả trường hợp backend trả về số thập phân như `0.82` hoặc số nguyên như `82`

### `getScoreColor(score)`

- Trả về class màu theo mức độ match rate

## Những gì hiện tại chưa có hoặc chưa xử lý

- Chưa có search/filter/sort trong danh sách proposed CVs
- Chưa có chọn số lượng item mỗi trang
- Chưa có error state riêng khi API lỗi
- Chưa có action khác ngoài xem chi tiết
- Chưa có hiển thị thêm thông tin như kinh nghiệm, kỹ năng, email hoặc số điện thoại
- Phần phân trang render toàn bộ số trang, nên nếu `totalPages` lớn thì UI có thể dài
- Khi `matchRate = 0`, UI hiện `--` thay vì `0%`

## Ghi chú thêm

- Component đang import `Eye` nhưng hiện chưa sử dụng
- Component vẫn gọi `useGetProposedCvsQuery(...)` miễn là có `jobId`, kể cả khi job đang ở trạng thái chưa publish; hiện tại UI chỉ chặn ở phần render

## Tóm tắt ngắn

Ở thời điểm hiện tại, `ProposedCVs.js` đã có đủ các phần nền tảng cho màn danh sách CV AI đề xuất:

- kiểm tra trạng thái publish của job
- gọi API lấy danh sách
- loading / empty / data state
- table hiển thị thông tin chính
- phân trang cơ bản
- điều hướng sang màn chi tiết proposed CV

Những phần nâng cao như filter, sorting, error handling chi tiết và nhiều action hơn vẫn chưa được triển khai.

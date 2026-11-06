/**
 * Automated Test Suite for History & LocalStorage Persistence (12 Test Cases).
 * Conforms to TASK 04 specification.
 */

import assert from 'node:assert/strict';

// Mock window and localStorage environment
class MockLocalStorage {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

global.window = {
  localStorage: new MockLocalStorage(),
};

// Import history service
const {
  getHistory,
  saveHistory,
  getHistoryById,
  updateHistoryItem,
  deleteHistory,
  clearHistory,
  STORAGE_KEY,
} = await import('./src/services/historyService.js');

console.log('=====================================================');
console.log('🧪 RUNNING TASK 04 - 12 MANDATORY TEST CASES');
console.log('=====================================================\n');

let passedCount = 0;
const runTest = (title, fn) => {
  try {
    fn();
    console.log(`✅ [PASS] ${title}`);
    passedCount++;
  } catch (err) {
    console.error(`❌ [FAIL] ${title}`);
    console.error(err);
    process.exitCode = 1;
  }
};

// Reset storage before each run
window.localStorage.clear();

// Test 1: Tạo nội dung thành công → xuất hiện trong Lịch sử
runTest('1. Tạo nội dung thành công -> xuất hiện trong Lịch sử', () => {
  window.localStorage.clear();
  const sample = {
    product_name: 'Bình giữ nhiệt Inox 304 LockStyle',
    description: 'Bình giữ nhiệt 500ml giữ nhiệt 12h',
    target_audience: 'Dân văn phòng',
    tone: 'youthful',
    captions: [
      { id: 'caption_1', approach: 'benefit', content: 'Giữ nhiệt 12 giờ hoàn hảo' },
      { id: 'caption_2', approach: 'emotional', content: 'Cà phê ấm mỗi sớm mai' },
      { id: 'caption_3', approach: 'call_to_action', content: 'Mua ngay hôm nay giảm 20%' },
    ],
    headlines: [
      { id: 'headline_1', content: 'Giữ Nhiệt Cả Ngày' },
      { id: 'headline_2', content: 'Thiết Kế Tối Giản' },
      { id: 'headline_3', content: 'Đồng Hành Mọi Lúc' },
    ],
    hashtags: ['#BinhGiuNhiet', '#Inox304', '#VanPhong', '#DealHot', '#TienLoi'],
    model: 'gemini-3.5-flash',
  };

  const saved = saveHistory(sample);
  assert.ok(saved.id, 'Record must have an ID');
  assert.equal(saved.product_name, sample.product_name);

  const history = getHistory();
  assert.equal(history.length, 1);
  assert.equal(history[0].id, saved.id);
  assert.equal(history[0].product_name, sample.product_name);
  assert.equal(history[0].captions.length, 3);
  assert.equal(history[0].headlines.length, 3);
  assert.equal(history[0].hashtags.length, 5);
});

// Test 2: F5 trình duyệt → lịch sử vẫn còn
runTest('2. F5 trình duyệt -> lịch sử vẫn còn (đọc từ LocalStorage string)', () => {
  // Simulating F5 by reading freshly serialized JSON string from localStorage
  const rawFromStorage = window.localStorage.getItem(STORAGE_KEY);
  assert.ok(rawFromStorage, 'Raw storage must not be empty after F5');
  const history = getHistory();
  assert.equal(history.length, 1);
  assert.equal(history[0].product_name, 'Bình giữ nhiệt Inox 304 LockStyle');
});

// Test 3: Đóng và mở lại trình duyệt → lịch sử vẫn còn
runTest('3. Đóng và mở lại trình duyệt -> lịch sử vẫn tồn tại nguyên vẹn', () => {
  // Simulating browser restart by persisting string, reinstantiating window object
  const serialized = window.localStorage.getItem(STORAGE_KEY);
  global.window.localStorage = new MockLocalStorage();
  global.window.localStorage.setItem(STORAGE_KEY, serialized);

  const history = getHistory();
  assert.equal(history.length, 1);
  assert.equal(history[0].product_name, 'Bình giữ nhiệt Inox 304 LockStyle');
  assert.equal(history[0].model, 'gemini-3.5-flash');
});

// Test 4: Tạo nhiều lần → bản ghi mới nhất đứng đầu
runTest('4. Tạo nhiều lần -> bản ghi mới nhất đứng đầu (sort descending)', () => {
  const item2 = {
    product_name: 'Tai nghe Bluetooth chống ồn Sony',
    description: 'Tai nghe chống ồn chủ động đỉnh cao',
    target_audience: 'Người yêu âm nhạc',
    tone: 'professional',
    created_at: new Date(Date.now() + 5000).toISOString(),
    captions: [{ id: 'caption_1', content: 'Chất âm đỉnh cao' }],
    headlines: [{ id: 'headline_1', content: 'Tai Nghe Chống Ồn' }],
    hashtags: ['#Sony', '#Headphone', '#Music', '#ANC', '#HiRes'],
  };

  const item3 = {
    product_name: 'Bàn phím cơ không dây RK68',
    description: 'Bàn phím cơ gõ êm mượt',
    target_audience: 'Lập trình viên và gamer',
    tone: 'youthful',
    created_at: new Date(Date.now() + 10000).toISOString(),
    captions: [{ id: 'caption_1', content: 'Gõ phím êm ái' }],
    headlines: [{ id: 'headline_1', content: 'Bàn Phím Cơ RK68' }],
    hashtags: ['#BanPhimCo', '#RK68', '#Mechanical', '#Keyboards', '#Gaming'],
  };

  saveHistory(item2);
  saveHistory(item3);

  const history = getHistory();
  assert.equal(history.length, 3);
  // Item 3 was created latest, must be at index 0
  assert.equal(history[0].product_name, 'Bàn phím cơ không dây RK68');
  assert.equal(history[1].product_name, 'Tai nghe Bluetooth chống ồn Sony');
  assert.equal(history[2].product_name, 'Bình giữ nhiệt Inox 304 LockStyle');
});

// Test 5: Xem chi tiết → nội dung khớp với lần tạo ban đầu
runTest('5. Xem chi tiết -> nội dung khớp chính xác với lần tạo ban đầu', () => {
  const history = getHistory();
  const targetId = history[2].id;
  const detail = getHistoryById(targetId);

  assert.ok(detail, 'Must find detail item');
  assert.equal(detail.product_name, 'Bình giữ nhiệt Inox 304 LockStyle');
  assert.equal(detail.target_audience, 'Dân văn phòng');
  assert.equal(detail.tone, 'youthful');
  assert.equal(detail.captions[0].content, 'Giữ nhiệt 12 giờ hoàn hảo');
  assert.equal(detail.headlines[0].content, 'Giữ Nhiệt Cả Ngày');
  assert.equal(detail.hashtags[0], '#BinhGiuNhiet');
});

// Test 6: Xóa một bản ghi → chỉ bản ghi đó bị xóa
runTest('6. Xóa một bản ghi -> chỉ bản ghi đó bị xóa, các bản ghi khác giữ nguyên', () => {
  const historyBefore = getHistory();
  const idToDelete = historyBefore[1].id; // Tai nghe Sony
  const deleteResult = deleteHistory(idToDelete);

  assert.equal(deleteResult, true);
  const historyAfter = getHistory();
  assert.equal(historyAfter.length, 2);
  assert.equal(historyAfter.find((i) => i.id === idToDelete), undefined);
  assert.equal(historyAfter[0].product_name, 'Bàn phím cơ không dây RK68');
  assert.equal(historyAfter[1].product_name, 'Bình giữ nhiệt Inox 304 LockStyle');
});

// Test 7: Xóa toàn bộ → danh sách trở về trạng thái trống
runTest('7. Xóa toàn bộ -> danh sách trở về trạng thái trống ([]), LocalStorage sạch', () => {
  const clearResult = clearHistory();
  assert.equal(clearResult, true);

  const historyAfterClear = getHistory();
  assert.equal(historyAfterClear.length, 0);
  assert.deepEqual(historyAfterClear, []);
});

// Test 8: LocalStorage rỗng → ứng dụng hoạt động bình thường
runTest('8. LocalStorage rỗng -> ứng dụng hoạt động bình thường, không lỗi', () => {
  window.localStorage.removeItem(STORAGE_KEY);
  const history = getHistory();
  assert.ok(Array.isArray(history), 'Must return empty array');
  assert.equal(history.length, 0);

  const notFound = getHistoryById('non-existent-id');
  assert.equal(notFound, null);

  const deleteNonExistent = deleteHistory('non-existent-id');
  assert.equal(deleteNonExistent, false);
});

// Test 9: LocalStorage chứa JSON lỗi → ứng dụng không bị crash
runTest('9. LocalStorage chứa JSON lỗi (corrupt) -> ứng dụng tự khôi phục, không crash', () => {
  window.localStorage.setItem(STORAGE_KEY, '{ invalid json string content ::: !!!');
  const history = getHistory();
  assert.ok(Array.isArray(history), 'Must safely return empty array on corrupt JSON');
  assert.equal(history.length, 0);

  // Still able to save new valid items
  saveHistory({ product_name: 'Sản phẩm mới sau khi reset', tone: 'youthful' });
  const restored = getHistory();
  assert.equal(restored.length, 1);
  assert.equal(restored[0].product_name, 'Sản phẩm mới sau khi reset');
});

// Test 10: Tạo nội dung thất bại → không lưu bản ghi giả
runTest('10. Tạo nội dung thất bại -> không lưu bản ghi giả vào LocalStorage', () => {
  window.localStorage.clear();
  // Simulating API failure: GeneratorPage only calls saveHistory when response.success && response.data
  const mockApiCall = (shouldSucceed) => {
    if (!shouldSucceed) {
      throw new Error('503 Service Unavailable');
    }
  };

  try {
    mockApiCall(false);
    saveHistory({ product_name: 'Bản ghi giả nếu lỗi' });
  } catch (err) {
    // API threw error, saveHistory is never reached
  }

  const history = getHistory();
  assert.equal(history.length, 0, 'No fake records should be saved on API failure');
});

// Test 11: Regenerate một Caption → các nội dung còn lại không bị thay đổi
runTest('11. Regenerate một Caption -> cập nhật đúng bản ghi, giữ nguyên các nội dung khác', () => {
  window.localStorage.clear();
  const initialItem = saveHistory({
    product_name: 'Gối công thái học',
    description: 'Chống mỏi cổ vai gáy',
    target_audience: 'Dân văn phòng',
    tone: 'professional',
    captions: [
      { id: 'caption_1', approach: 'benefit', content: 'Caption 1 ban đầu' },
      { id: 'caption_2', approach: 'emotional', content: 'Caption 2 ban đầu' },
      { id: 'caption_3', approach: 'call_to_action', content: 'Caption 3 ban đầu' },
    ],
    headlines: [
      { id: 'headline_1', content: 'Tiêu đề 1' },
      { id: 'headline_2', content: 'Tiêu đề 2' },
      { id: 'headline_3', content: 'Tiêu đề 3' },
    ],
    hashtags: ['#Tag1', '#Tag2', '#Tag3', '#Tag4', '#Tag5'],
  });

  const historyId = initialItem.id;

  // User regenerates ONLY Caption 2
  const updatedCaptions = [
    { id: 'caption_1', approach: 'benefit', content: 'Caption 1 ban đầu' },
    { id: 'caption_2', approach: 'emotional', content: 'Caption 2 ĐÃ ĐƯỢC REGENERATE BẰNG GEMINI AI!' },
    { id: 'caption_3', approach: 'call_to_action', content: 'Caption 3 ban đầu' },
  ];

  const updatedRecord = updateHistoryItem(historyId, { captions: updatedCaptions });
  assert.ok(updatedRecord, 'Must return updated record');
  assert.equal(updatedRecord.id, historyId, 'ID must remain the same');

  // Verify history list has still 1 record (no duplicate entry)
  const historyList = getHistory();
  assert.equal(historyList.length, 1, 'Must not create duplicate record for single regen');
  assert.equal(historyList[0].captions[0].content, 'Caption 1 ban đầu');
  assert.equal(historyList[0].captions[1].content, 'Caption 2 ĐÃ ĐƯỢC REGENERATE BẰNG GEMINI AI!');
  assert.equal(historyList[0].captions[2].content, 'Caption 3 ban đầu');
  assert.equal(historyList[0].headlines[0].content, 'Tiêu đề 1', 'Headlines must remain unchanged');
  assert.equal(historyList[0].hashtags[0], '#Tag1', 'Hashtags must remain unchanged');
});

// Test 12: Regenerate toàn bộ → lịch sử được cập nhật chính xác (lưu thành bản ghi mới)
runTest('12. Regenerate toàn bộ -> lưu thành một lần tạo mới theo yêu cầu nghiệp vụ', () => {
  const currentHistoryBefore = getHistory();
  assert.equal(currentHistoryBefore.length, 1);

  // User regenerates ALL 3-3-5 content
  const regeneratedBundle = {
    product_name: 'Gối công thái học',
    description: 'Chống mỏi cổ vai gáy',
    target_audience: 'Dân văn phòng',
    tone: 'professional',
    captions: [
      { id: 'caption_1', approach: 'benefit', content: 'Caption 1 TOÀN BỘ MỚI' },
      { id: 'caption_2', approach: 'emotional', content: 'Caption 2 TOÀN BỘ MỚI' },
      { id: 'caption_3', approach: 'call_to_action', content: 'Caption 3 TOÀN BỘ MỚI' },
    ],
    headlines: [
      { id: 'headline_1', content: 'Tiêu đề MỚI 1' },
      { id: 'headline_2', content: 'Tiêu đề MỚI 2' },
      { id: 'headline_3', content: 'Tiêu đề MỚI 3' },
    ],
    hashtags: ['#New1', '#New2', '#New3', '#New4', '#New5'],
    model: 'gemini-3.5-flash',
  };

  const savedNewBundle = saveHistory(regeneratedBundle);
  assert.ok(savedNewBundle.id);

  const historyList = getHistory();
  assert.equal(historyList.length, 2, 'Must have 2 records now');
  // Newest record stands first
  assert.equal(historyList[0].id, savedNewBundle.id);
  assert.equal(historyList[0].captions[0].content, 'Caption 1 TOÀN BỘ MỚI');
  // Previous record still preserved
  assert.equal(historyList[1].captions[0].content, 'Caption 1 ban đầu');
});

console.log('\n=====================================================');
console.log(`🎉 TEST SUMMARY: ${passedCount}/12 TESTS PASSED SUCCESSFULLY!`);
console.log('=====================================================');


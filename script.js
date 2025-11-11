// ตรวจสอบว่า Web Speech API (SpeechRecognition) รองรับในเบราว์เซอร์หรือไม่
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const startStopButton = document.getElementById('startStopButton');
const outputDiv = document.getElementById('output');
const statusDiv = document.getElementById('status');

let recognition;
let isListening = false;

// 1. ตรวจสอบการรองรับ API
if (!SpeechRecognition) {
    statusDiv.textContent = 'ขออภัย เบราว์เซอร์ของคุณไม่รองรับ Speech Recognition';
    startStopButton.disabled = true;
} else {
    // 2. สร้างวัตถุ SpeechRecognition
    recognition = new SpeechRecognition();
    
    // ตั้งค่าคุณสมบัติ
    recognition.lang = 'th-TH'; // กำหนดภาษาเป็นภาษาไทย
    recognition.continuous = true; // ให้รับฟังอย่างต่อเนื่องจนกว่าจะหยุดเอง
    recognition.interimResults = true; // แสดงผลลัพธ์ชั่วคราวขณะที่พูด
    recognition.maxAlternatives = 1;

    // 3. จัดการเหตุการณ์ (Events)
    
    // เมื่อการรับฟังเริ่มต้น
    recognition.onstart = function() {
        isListening = true;
        startStopButton.textContent = 'กำลังฟัง... (คลิกเพื่อหยุด)';
        statusDiv.textContent = 'กำลังฟัง... กรุณาพูด';
        startStopButton.style.backgroundColor = '#f44336'; // สีแดง
    };

    // เมื่อมีผลลัพธ์การแปลงเสียงออกมา
    recognition.onresult = function(event) {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            
            if (event.results[i].isFinal) {
                // ข้อความสุดท้ายที่ได้รับการยืนยัน
                finalTranscript += transcript + '\n'; 
            } else {
                // ข้อความชั่วคราว (แสดงขณะพูด)
                interimTranscript += transcript;
            }
        }
        
        // แสดงผลลัพธ์
        // เราจะแสดงผลลัพธ์สุดท้ายที่ได้รับการยืนยัน
        outputDiv.textContent += finalTranscript;
        
        // ถ้าคุณต้องการให้เห็นข้อความที่พิมพ์แบบเรียลไทม์ (interim) 
        // อาจจะต้องจัดการให้แสดงในส่วนอื่น และอัปเดตใหม่ทุกครั้ง
    };
    
    // เมื่อการรับฟังหยุดลง
    recognition.onend = function() {
        isListening = false;
        startStopButton.textContent = 'เริ่มพูด';
        statusDiv.textContent = 'หยุดรับฟังแล้ว คลิก "เริ่มพูด" เพื่อเริ่มอีกครั้ง';
        startStopButton.style.backgroundColor = '#4CAF50'; // สีเขียว
    };

    // เมื่อเกิดข้อผิดพลาด
    recognition.onerror = function(event) {
        statusDiv.textContent = 'เกิดข้อผิดพลาด: ' + event.error;
        isListening = false;
        startStopButton.textContent = 'เริ่มพูด';
        startStopButton.style.backgroundColor = '#4CAF50';
    };

    // 4. จัดการปุ่มเริ่ม/หยุด
    startStopButton.addEventListener('click', () => {
        if (isListening) {
            recognition.stop(); // หยุดการรับฟัง
        } else {
            // ล้างข้อความเก่าก่อนเริ่มใหม่
            // outputDiv.textContent = ''; 
            recognition.start(); // เริ่มการรับฟัง
        }
    });
}
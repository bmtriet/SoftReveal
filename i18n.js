const translations = {
    en: {
        tagline: "Reveal less. Engage more.",
        hero_desc: "SoftReveal is not a 'image blurring' app. It is a tool for controlling the pace of information disclosure, born for the era of screen recording and visual storytelling.",
        enter_app: "Enter App",
        what_is_title: "What is SoftReveal?",
        what_is_desc: "A web application that allows you to paste images and control exactly what to show and when to show it.",
        features: [
            { title: "Clipboard Ready", desc: "Paste images directly from your clipboard or drag and drop files." },
            { title: "Custom Blur", desc: "Define blur areas and intensity precisely to your needs." },
            { title: "Click to Reveal", desc: "Reveal hidden areas one by one during your recording or stream." },
            { title: "No Spoils", desc: "Keep the audience engaged by showing only what matters at the right moment." }
        ],
        problem_title: "The Problem We Solve",
        problem_desc: "In short videos and livestreams, content is often spoiled too early, causing viewers to drop off. SoftReveal gives you back control over curiosity.",
        targets_title: "Who is it for?",
        targets: [
            { title: "Content Creators", desc: "Keep viewers hooked for those 'A-ha!' moments in your breakdown videos." },
            { title: "Educators & Mentors", desc: "Explain complex documents by revealing parts as you speak." },
            { title: "Tech & Data People", desc: "Share logs or reports without leaking sensitive info immediately." },
            { title: "Social Media Analysts", desc: "Tell stories through comment chains or tweet threads with rhythm." }
        ],
        philosophy_quote: "Attention isn't lost because of bad content, but because it was revealed too early.",
        philosophy_tag: "SoftReveal — Control the moment, not just the image."
    },
    vi: {
        tagline: "Tiết lộ ít hơn. Thu hút nhiều hơn.",
        hero_desc: "SoftReveal không phải là một app 'làm mờ ảnh'. Nó là một công cụ điều khiển nhịp hé lộ thông tin, sinh ra cho thời đại quay màn hình và kể chuyện bằng thị giác.",
        enter_app: "Vào ứng dụng",
        what_is_title: "SoftReveal là gì?",
        what_is_desc: "Một ứng dụng web cho phép bạn dán ảnh và kiểm soát chính xác thứ gì được hiển thị và khi nào hiển thị.",
        features: [
            { title: "Dán từ Clipboard", desc: "Dán ảnh trực tiếp từ clipboard hoặc kéo thả tệp tin." },
            { title: "Làm mờ tùy chỉnh", desc: "Xác định vùng làm mờ và cường độ chính xác theo nhu cầu." },
            { title: "Click để hé lộ", desc: "Hé lộ các vùng ẩn từng cái một trong khi quay màn hình hoặc stream." },
            { title: "Tránh spoil", desc: "Giữ người xem ở lại bằng cách chỉ cho thấy những gì quan trọng đúng lúc." }
        ],
        problem_title: "Vấn đề chúng tôi giải quyết",
        problem_desc: "Trong video ngắn và livestream, nội dung thường bị lộ quá sớm, khiến người xem rời đi. SoftReveal trả lại quyền kiểm soát sự tò mò cho bạn.",
        targets_title: "Dành cho ai?",
        targets: [
            { title: "Nhà sáng tạo nội dung", desc: "Giữ người xem đến những giây phút 'à ha' trong các video phân tích." },
            { title: "Người dạy & Mentor", desc: "Giải thích tài liệu phức tạp bằng cách hé lộ từng phần khi giảng bài." },
            { title: "Kỹ thuật & Dữ liệu", desc: "Chia sẻ log hoặc báo cáo mà không lộ thông tin nhạy cảm ngay lập tức." },
            { title: "Phân tích MXH", desc: "Kể chuyện qua các chuỗi bình luận hoặc tweet có nhịp điệu." }
        ],
        philosophy_quote: "Sự chú ý không mất đi vì nội dung kém, mà vì nội dung bị lộ quá sớm.",
        philosophy_tag: "SoftReveal — Điều khiển khoảnh khắc, không chỉ là hình ảnh."
    },
    zh: {
        tagline: "揭示更少，吸引更多。",
        hero_desc: "SoftReveal 不是一個「模糊圖片」的應用。它是一個控制信息揭示節奏的工具，為螢幕錄製和視覺敘事時代而生。",
        enter_app: "進入應用",
        what_is_title: "什麼是 SoftReveal？",
        what_is_desc: "一個允許您貼上圖片並精確控制顯示內容和時機的網頁應用。",
        features: [
            { title: "剪貼板支援", desc: "直接從剪貼板貼上圖片或拖放文件。" },
            { title: "自定義模糊", desc: "根據您的需求精確定義模糊區域和強度。" },
            { title: "點擊揭示", desc: "在錄製或直播期間逐一揭示隱藏區域。" },
            { title: "拒絕劇透", desc: "通過在正確的時刻僅顯示重要的內容來保持觀眾的參與度。" }
        ],
        problem_title: "我們解決的問題",
        problem_desc: "在短影片和直播中，內容往往過早劇透，導致觀眾流失。SoftReveal 讓您重新掌控好奇心。",
        targets_title: "適用對象？",
        targets: [
            { title: "內容創作者", desc: "在您的分析影片中讓觀眾為那些「原來如此」的時刻保持期待。" },
            { title: "教育者與導師", desc: "在講解時通過逐步揭示部分內容來解釋複雜文件。" },
            { title: "技術與數據人員", desc: "分享日誌或報告而不會立即洩露敏感信息。" },
            { title: "社群媒體分析師", desc: "有節奏地通過評論鏈或推文串講述故事。" }
        ],
        philosophy_quote: "注意力流失不是因為內容不好，而是因為它被揭示得太早了。",
        philosophy_tag: "SoftReveal — 掌控時刻，而不僅僅是圖像。"
    }
};

const langButtons = document.querySelectorAll('.lang-btn');

function updateActiveButton(lang) {
    langButtons.forEach(btn => {
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function updateLanguage(lang) {
    const t = translations[lang];
    if (!t) return;

    document.title = `SoftReveal — ${t.tagline}`;

    // Header
    const enterBtn = document.querySelector('.enter-btn');
    if (enterBtn) enterBtn.textContent = t.enter_app;

    // Hero
    const tagline = document.querySelector('.tagline');
    const heroDesc = document.querySelector('.hero-desc');
    if (tagline) tagline.textContent = t.tagline;
    if (heroDesc) heroDesc.textContent = t.hero_desc;

    // What is SoftReveal
    const whatIsTitle = document.querySelector('#what-is h2');
    if (whatIsTitle) whatIsTitle.textContent = t.what_is_title;

    const featureCards = document.querySelectorAll('#what-is .card');
    if (featureCards.length > 0) {
        t.features.forEach((f, i) => {
            if (featureCards[i]) {
                featureCards[i].querySelector('h3').textContent = f.title;
                featureCards[i].querySelector('p').textContent = f.desc;
            }
        });
    }

    // Problem
    const problemTitle = document.querySelector('#problem h2');
    const problemDesc = document.querySelector('#problem p');
    if (problemTitle) problemTitle.textContent = t.problem_title;
    if (problemDesc) problemDesc.textContent = t.problem_desc;

    // Target Users
    const targetsTitle = document.querySelector('#targets h2');
    if (targetsTitle) targetsTitle.textContent = t.targets_title;

    const targetCards = document.querySelectorAll('#targets .card');
    if (targetCards.length > 0) {
        t.targets.forEach((ts, i) => {
            if (targetCards[i]) {
                targetCards[i].querySelector('h3').textContent = ts.title;
                targetCards[i].querySelector('p').textContent = ts.desc;
            }
        });
    }

    // Philosophy
    const quote = document.querySelector('.quote');
    const philDesc = document.querySelector('.philosophy p');
    if (quote) quote.textContent = t.philosophy_quote;
    if (philDesc) philDesc.textContent = t.philosophy_tag;

    updateActiveButton(lang);
}

langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        updateLanguage(lang);
        localStorage.setItem('softreveal_lang', lang);
    });
});

// Init
const savedLang = localStorage.getItem('softreveal_lang') || 'en';
updateLanguage(savedLang);

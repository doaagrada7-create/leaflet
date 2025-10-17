let map;    // لمتغير الخريطة
let marker; // لمتغير علامة الموقع

// تهيئة الخريطة وإضافة طبقة OpenStreetMap
function initializeMap() {
    // إنشاء كائن الخريطة وتعيين مركز مبدئي (0, 0)
    map = L.map('map').setView([0, 0], 2); 

    // إضافة طبقات الخريطة الأساسية من OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    // بدء وظيفة التتبع
    trackUserLocation();
}

// دالة تتبع الموقع الجغرافي الفعلي
function trackUserLocation() {
    // التحقق من دعم المتصفح لخاصية الموقع الجغرافي
    if (!navigator.geolocation) {
        alert('المتصفح لا يدعم خاصية تحديد الموقع الجغرافي.');
        return;
    }

    // "watchPosition" تراقب الموقع باستمرار وتحدثه في كل تغيير
    navigator.geolocation.watchPosition(
        (position) => {
            // استخلاص خط الطول والعرض الجديدين
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const currentPos = [lat, lng];

            // 1. إذا كانت هذه أول قراءة للموقع، نقوم بإنشاء العلامة
            if (!marker) {
                marker = L.marker(currentPos).addTo(map)
                    .bindPopup("موقعك الحالي").openPopup();

                // عند أول قراءة، ننتقل بالخريطة إلى الموقع ونكبر الزوم
                map.setView(currentPos, 16); 
            } else {
                // 2. في كل قراءة لاحقة، نقوم فقط بتحديث موضع العلامة
                marker.setLatLng(currentPos).update();
                
                // تحديث مركز الخريطة ليظل الموقع في المنتصف
                map.panTo(currentPos);
            }
        },
        (error) => {
            // معالجة الأخطاء (مثل رفض المستخدم، أو عدم توفر GPS)
            console.error(error);
            alert(`خطأ: لم نتمكن من تحديد موقعك. تأكد من تفعيل خدمة الموقع والسماح للمتصفح بالوصول إليها. ${error.message}`);
        },
        {
            // خيارات لتحسين دقة التتبع
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

// تشغيل وظيفة تهيئة الخريطة عند تحميل ملف السكريبت
initializeMap();
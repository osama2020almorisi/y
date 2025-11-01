// بيانات المتطلبات
let travelData = {};

// تحميل البيانات من ملف JSON
async function loadData() {
    try {
        const response = await fetch('data.json');
        travelData = await response.json();
        initializePage();
    } catch (error) {
        console.error('Error loading data:', error);
        alert('حدث خطأ في تحميل البيانات');
    }
}

// تهيئة الصفحة
function initializePage() {
    // تعبئة خيارات الوجهات
    const destinationSelect = document.getElementById('destination');
    destinationSelect.innerHTML = '<option value="">-- اختر الوجهة --</option>';
    
    Object.keys(travelData.destinations).forEach(destination => {
        const option = document.createElement('option');
        option.value = destination;
        option.textContent = destination;
        destinationSelect.appendChild(option);
    });

    // عرض التعليمات العامة
    displayGeneralInstructions();

    // إضافة المستمعين للأحداث
    document.getElementById('destination').addEventListener('change', updateCities);
    document.getElementById('searchBtn').addEventListener('click', searchRequirements);
}

// تحديث قائمة المدن بناءً على الوجهة المختارة
function updateCities() {
    const destination = document.getElementById('destination').value;
    const citySelect = document.getElementById('city');
    citySelect.innerHTML = '<option value="">-- اختر المدينة --</option>';

    if (destination && travelData.destinations[destination]) {
        travelData.destinations[destination].cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }
}

// عرض التعليمات العامة
function displayGeneralInstructions() {
    const generalInstructions = document.getElementById('generalInstructions');
    
    if (travelData.general_requirements) {
        let html = `
            <div class="section">
                <h3>📋 ${travelData.general_requirements.title}</h3>
                <ul>
                    ${travelData.general_requirements.instructions.map(instruction => 
                        `<li>${instruction}</li>`
                    ).join('')}
                </ul>
            </div>
            
            <div class="section">
                <h3>🎒 معلومات الأمتعة</h3>
                <div class="baggage-item">
                    <strong>حقيبة اليد:</strong> ${travelData.general_requirements.baggage.hand_baggage}
                </div>
                <div class="baggage-item">
                    <strong>الدرجة السياحية:</strong> ${travelData.general_requirements.baggage.economy}
                </div>
                <div class="baggage-item">
                    <strong>درجة رجال الأعمال والأولى:</strong> ${travelData.general_requirements.baggage.business_first}
                </div>
            </div>
            
            <div class="note">
                <strong>ملاحظة هامة:</strong>
                <p>${travelData.general_requirements.note}</p>
            </div>
        `;
        
        generalInstructions.innerHTML = html;
    }
}

// البحث عن المتطلبات
function searchRequirements() {
    const nationality = document.getElementById('nationality').value;
    const destination = document.getElementById('destination').value;
    const city = document.getElementById('city').value;

    if (!nationality || !destination || !city) {
        alert('يرجى اختيار جميع الخيارات');
        return;
    }

    const destinationData = travelData.destinations[destination];
    if (!destinationData) return;

    // عرض النتائج
    document.getElementById('results').style.display = 'block';
    document.getElementById('destinationTitle').textContent = `متطلبات السفر إلى ${destination} - ${city}`;

    // المتطلبات الأساسية
    const basicRequirements = document.getElementById('basicRequirements');
    basicRequirements.innerHTML = destinationData.requirements.map(req => 
        `<li>${req}</li>`
    ).join('');

    // معلومات الأمتعة
    const baggageInfo = document.getElementById('baggageInfo');
    baggageInfo.innerHTML = `
        <div class="baggage-item">${travelData.general_requirements.baggage.hand_baggage}</div>
        <div class="baggage-item">${travelData.general_requirements.baggage.economy}</div>
        <div class="baggage-item">${travelData.general_requirements.baggage.business_first}</div>
    `;

    // أسعار الوزن الزائد
    const excessWeight = document.getElementById('excessWeight');
    if (destinationData.excess_weight) {
        excessWeight.innerHTML = Object.entries(destinationData.excess_weight).map(([to, price]) =>
            `<div class="weight-item"><strong>إلى ${to}:</strong> ${price}</div>`
        ).join('');
    }

    // الروابط المهمة
    const importantLinks = document.getElementById('importantLinks');
    if (destinationData.links) {
        importantLinks.innerHTML = Object.entries(destinationData.links).map(([text, url]) =>
            `<div class="link-item"><a href="${url}" target="_blank">${text}</a></div>`
        ).join('');
    } else {
        importantLinks.innerHTML = '<div>لا توجد روابط متاحة</div>';
    }

    // الملاحظة العامة
    document.getElementById('generalNote').textContent = travelData.general_requirements.note;

    // التمرير إلى النتائج
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

// تحميل البيانات عند فتح الصفحة
document.addEventListener('DOMContentLoaded', loadData);

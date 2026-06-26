import { Question } from "../../types/questions"

export const farmerQuestions: Question[] = [
 
    {
    id: "name",
    section: "farmer",
    field: "farmer.name",

    question: {
        en: "What is your full name?",
        te: "మీ పూర్తి పేరు ఏమిటి?",
        hi: "आपका पूरा नाम क्या है?",
        kn: "ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು ಏನು?",
        ta: "உங்கள் முழு பெயர் என்ன?",
        mr: "तुमचे पूर्ण नाव काय आहे?",
        gu: "તમારું પૂરું નામ શું છે?",
    },

    placeholder: {
        en: "Enter your full name",
        te: "మీ పూర్తి పేరును నమోదు చేయండి",
        hi: "अपना पूरा नाम दर्ज करें",
        kn: "ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ",
        ta: "உங்கள் முழு பெயரை உள்ளிடவும்",
        mr: "तुमचे पूर्ण नाव प्रविष्ट करा",
        gu: "તમારું પૂરું નામ દાખલ કરો",
    },

    type: "text",
    required: true,
    minLength: 1,
},

{
    id: "DOB",
    section: "farmer",
    field: "farmer.DOB",

    question: {
        en: "What is your date of birth?",
        te: "మీ జన్మ తేదీ ఏమిటి?",
        hi: "आपकी जन्म तिथि क्या है?",
        kn: "ನಿಮ್ಮ ಜನ್ಮ ದಿನಾಂಕ ಏನು?",
        ta: "உங்கள் பிறந்த தேதி என்ன?",
        mr: "तुमची जन्मतारीख काय आहे?",
        gu: "તમારી જન્મ તારીખ શું છે?",
    },

    placeholder: {
        en: "Select date",
        te: "తేదీని ఎంచుకోండి",
        hi: "तिथि चुनें",
        kn: "ದಿನಾಂಕವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
        ta: "தேதியைத் தேர்ந்தெடுக்கவும்",
        mr: "तारीख निवडा",
        gu: "તારીખ પસંદ કરો",
    },

    type: "date",
    required: true,
},

{
    id: "gender",
    section: "farmer",
    field: "farmer.gender",

    question: {
        en: "What is your gender?",
        te: "మీ లింగం ఏమిటి?",
        hi: "आपका लिंग क्या है?",
        kn: "ನಿಮ್ಮ ಲಿಂಗ ಯಾವುದು?",
        ta: "உங்கள் பாலினம் என்ன?",
        mr: "तुमचे लिंग काय आहे?",
        gu: "તમારું લિંગ શું છે?",
    },

    type: "select",
    required: true,

    options: [
            {
                en: "Male",
                te: "పురుషుడు",
                hi: "पुरुष",
                kn: "ಪುರುಷ",
                ta: "ஆண்",
                mr: "पुरुष",
                gu: "પુરુષ",
            },
            {
                en: "Female",
                te: "మహిళ",
                hi: "महिला",
                kn: "ಮಹಿಳೆ",
                ta: "பெண்",
                mr: "महिला",
                gu: "મહિલા",
            },
        
            {
                en: "Other",
                te: "ఇతర",
                hi: "अन्य",
                kn: "ಇತರೆ",
                ta: "மற்றவை",
                mr: "इतर",
                gu: "અન્ય",
            },
    ],
},
/*
{
    id: "mobile_num",
    section: "farmer",
    field: "farmer.mobile_num",

    question: {
        en: "What is your mobile number?",
        te: "మీ మొబైల్ నంబర్ ఏమిటి?",
        hi: "आपका मोबाइल नंबर क्या है?",
        kn: "ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಏನು?",
        ta: "உங்கள் மொபைல் எண் என்ன?",
        mr: "तुमचा मोबाईल क्रमांक काय आहे?",
        gu: "તમારો મોબાઇલ નંબર શું છે?",
    },

    placeholder: {
        en: "Enter your mobile number",
        te: "మీ మొబైల్ నంబర్ నమోదు చేయండి",
        hi: "अपना मोबाइल नंबर दर्ज करें",
        kn: "ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ",
        ta: "உங்கள் மொபைல் எண்ணை உள்ளிடவும்",
        mr: "तुमचा मोबाईल क्रमांक प्रविष्ट करा",
        gu: "તમારો મોબાઇલ નંબર દાખલ કરો",
    },

    type: "text",
    required: true,
    minLength: 10,
    maxLength: 10,
    pattern: /^[6-9]\d{9}$/,
},
*/

{
    id: "village",
    section: "farmer",
    field: "farmer.village",

    question: {
        en: "Which village do you live in?",
        te: "మీరు ఏ గ్రామంలో నివసిస్తున్నారు?",
        hi: "आप किस गाँव में रहते हैं?",
        kn: "ನೀವು ಯಾವ ಗ್ರಾಮದಲ್ಲಿ ವಾಸಿಸುತ್ತಿದ್ದೀರಿ?",
        ta: "நீங்கள் எந்த கிராமத்தில் வசிக்கிறீர்கள்?",
        mr: "तुम्ही कोणत्या गावात राहता?",
        gu: "તમે કયા ગામમાં રહો છો?",
    },

    placeholder: {
        en: "Enter your village name",
        te: "మీ గ్రామం పేరును నమోదు చేయండి",
        hi: "अपने गाँव का नाम दर्ज करें",
        kn: "ನಿಮ್ಮ ಗ್ರಾಮದ ಹೆಸರನ್ನು ನಮೂದಿಸಿ",
        ta: "உங்கள் கிராமத்தின் பெயரை உள்ளிடவும்",
        mr: "तुमच्या गावाचे नाव प्रविष्ट करा",
        gu: "તમારા ગામનું નામ દાખલ કરો",
    },

    type: "text",
    required: true,
    minLength: 2,
},
/*
    {
        id: "pincode",
        section: "farmer",
        field: "farmer.pincode",
        question: "What is your village pincode?",
        type: "text",
        required : true,
        minLength : 6,
        maxLength : 6,
        pattern : /^[1-9][0-9]{5}$/,
    },
*/

{
    id: "farmer_photo",
    section: "farmer",
    field: "farmer.photo",

    question: {
        en: "Capture a photo of the farmer",
        te: "రైతు ఫోటో తీయండి",
        hi: "किसान की फोटो लें",
        kn: "ರೈತನ ಫೋಟೋ ತೆಗೆದುಕೊಳ್ಳಿ",
        ta: "விவசாயியின் புகைப்படத்தை எடுக்கவும்",
        mr: "शेतकऱ्याचा फोटो काढा",
        gu: "ખેડૂતનો ફોટો લો",
    },

    type: "image",
    required: true,
},
];
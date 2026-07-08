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
},

{
    id: "age",
    section: "farmer",
    field: "farmer.age",

    question: {
        en: "What is your age?",
        te: "మీ వయస్సు ఎంత?",
        hi: "आपकी आयु क्या है?",
        kn: "ನಿಮ್ಮ ವಯಸ್ಸು ಎಷ್ಟು?",
        ta: "உங்கள் வயது என்ன?",
        mr: "तुमचे वय किती आहे?",
        gu: "તમારી ઉંમર કેટલી છે?",
    },

    placeholder: {
        en: "Enter age",
        te: "వయస్సును నమోదు చేయండి",
        hi: "आयु दर्ज करें",
        kn: "ವಯಸ್ಸನ್ನು ನಮೂದಿಸಿ",
        ta: "வயதை உள்ளிடவும்",
        mr: "वय प्रविष्ट करा",
        gu: "ઉંમર દાખલ કરો",
    },

    type: "number",
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

    
{
        id: "pincode",
        section: "farmer",
        field: "farmer.pincode",
        question: {
            en: "What is your village pincode?",
            te: "మీ గ్రామం పిన్‌కోడ్ ఏమిటి?",
            hi: "आपके गाँव का पिनकोड क्या है?",
            kn: "ನಿಮ್ಮ ಗ್ರಾಮದ ಪಿನ್‌ಕೋಡ್ ಏನು?",
            ta: "உங்கள் கிராமத்தின் அஞ்சல் குறியீடு என்ன?",
            mr: "तुमच्या गावाचा पिनकोड काय आहे?",
            gu: "તમારા ગામનો પિનકોડ શું છે?",
        },
        type: "text",
        minLength : 6,
        maxLength : 6,
        pattern : /^[1-9][0-9]{5}$/,
},


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
},
];
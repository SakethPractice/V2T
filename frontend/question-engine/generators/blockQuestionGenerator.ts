import { Question } from "../../types/questions";

export const generateBlockQuestions = (
  blockCount: number
): Question[] => {
  const questions: Question[] = [];

  for (let i = 1; i <= blockCount; i++) {
    questions.push(
      {
        id: `block_${i}_name`,
        section: "block",
        field: `blocks[${i - 1}].name`,
        question: {
          en: `What is the name of Block ${i}?`,
          te: `బ్లాక్ ${i} పేరు ఏమిటి?`,
          hi: `ब्लॉक ${i} का नाम क्या है?`,
          kn: `ಬ್ಲಾಕ್ ${i} ರ ಹೆಸರು ಏನು?`,
          ta: `பகுதி ${i} இன் பெயர் என்ன?`,
          mr: `ब्लॉक ${i} चे नाव काय आहे?`,
          gu: `બ્લોક ${i} નું નામ શું છે?`,
        },
        placeholder: {
          en: "Enter block name",
          te: "బ్లాక్ పేరును నమోదు చేయండి",
          hi: "ब्लॉक का नाम दर्ज करें",
          kn: "ಬ್ಲಾಕ್ ಹೆಸರನ್ನು ನಮೂದಿಸಿ",
          ta: "பகுதியின் பெயரை உள்ளிடவும்",
          mr: "ब्लॉकचे नाव प्रविष्ट करा",
          gu: "બ્લોકનું નામ દાખલ કરો",
        },
        type: "text",
        minLength: 1,
      },

      {
        id: `block_${i}_area`,
        section: "block",
        field: `blocks[${i - 1}].area`,
        question: {
          en: `What is the area of Block ${i}?`,
          te: `బ్లాక్ ${i} విస్తీర్ణం ఎంత?`,
          hi: `ब्लॉक ${i} का क्षेत्रफल कितना है?`,
          kn: `ಬ್ಲಾಕ್ ${i} ರ ವಿಸ್ತೀರ್ಣ ಎಷ್ಟು?`,
          ta: `பகுதி ${i} இன் பரப்பளவு எவ்வளவு?`,
          mr: `ब्लॉक ${i} चे क्षेत्रफळ किती आहे?`,
          gu: `બ્લોક ${i} નો વિસ્તાર કેટલો છે?`,
        },
        placeholder: {
          en: "Enter block area",
          te: "బ్లాక్ విస్తీర్ణాన్ని నమోదు చేయండి",
          hi: "ब्लॉक का क्षेत्रफल दर्ज करें",
          kn: "ಬ್ಲಾಕ್ ವಿಸ್ತೀರ್ಣವನ್ನು ನಮೂದಿಸಿ",
          ta: "பகுதியின் பரப்பளவை உள்ளிடவும்",
          mr: "ब्लॉकचे क्षेत्रफळ प्रविष्ट करा",
          gu: "બ્લોકનો વિસ્તાર દાખલ કરો",
        },
        type: "number",
        min: 0.5,
      },
      {
        id: `block_${i}_farming_type`,
        section: "block",
        field: `blocks[${i - 1}].farmingType`,
        question: {
          en: `What is the farming type of Block ${i}?`,
          te: `బ్లాక్ ${i} లో ఏ విధమైన వ్యవసాయం చేస్తున్నారు?`,
          hi: `ब्लॉक ${i} में किस प्रकार की खेती की जाती है?`,
          kn: `ಬ್ಲಾಕ್ ${i} ನಲ್ಲಿ ಯಾವ ರೀತಿಯ ಕೃಷಿ ಮಾಡಲಾಗುತ್ತಿದೆ?`,
          ta: `பகுதி ${i} யில் எந்த வகையான விவசாயம் செய்யப்படுகிறது?`,
          mr: `ब्लॉक ${i} मध्ये कोणत्या प्रकारची शेती केली जाते?`,
          gu: `બ્લોક ${i} માં કયા પ્રકારની ખેતી થાય છે?`,
        },
        type: "select",
        options: [
          {
            en: "Integrated",
            te: "సమగ్ర",
            hi: "एकीकृत",
            kn: "ಸಮಗ್ರ",
            ta: "ஒருங்கிணைந்த",
            mr: "एकात्मिक",
            gu: "સંકલિત",
          },
          {
            en: "Non-Chemical",
            te: "రసాయన రహిత",
            hi: "रसायन-मुक्त",
            kn: "ರಾಸಾಯನಿಕ ರಹಿತ",
            ta: "ரசாயனமற்ற",
            mr: "रसायनमुक्त",
            gu: "રાસાયણિક મુક્ત",
          },
        ],
      },
      {
        id: `block_${i}_soil`,
        section: "block",
        field: `blocks[${i - 1}].soil`,
        question: {
          en: "What type of soil is present on your farm?",
          te: "మీ వ్యవసాయ క్షేత్రంలో ఏ రకమైన నేల ఉంది?",
          hi: "आपके खेत में किस प्रकार की मिट्टी है?",
          kn: "ನಿಮ್ಮ ಜಮೀನಿನಲ್ಲಿ ಯಾವ ರೀತಿಯ ಮಣ್ಣು ಇದೆ?",
          ta: "உங்கள் பண்ணையில் எந்த வகை மண் உள்ளது?",
          mr: "तुमच्या शेतात कोणत्या प्रकारची माती आहे?",
          gu: "તમારા ખેતરમાં કઈ પ્રકારની જમીન છે?",
        },
        type: "select",
        options: [
          {
            en: "Black",
            te: "నల్ల",
            hi: "काली",
            kn: "ಕಪ್ಪು",
            ta: "கருப்பு",
            mr: "काळी",
            gu: "કાળી",
          },
          {
            en: "Loamy",
            te: "లోమీ",
            hi: "दोमट",
            kn: "ಲೋಮಿ",
            ta: "லோமி",
            mr: "गाळयुक्त",
            gu: "દોમટી",
          },
          {
            en: "Sandy",
            te: "ఇసుక",
            hi: "रेतीली",
            kn: "ಮರಳು",
            ta: "மணல்",
            mr: "वाळू",
            gu: "રેતીલી",
          },
          {
            en: "Sandyloamy",
            te: "ఇసుక లోమీ",
            hi: "रेतीली दोमट",
            kn: "ಮರಳು ಲೋಮಿ",
            ta: "மணல் லோமி",
            mr: "वाळूगाळ",
            gu: "રેતીલી દોમટી",
          },
          {
            en: "Red",
            te: "ఎరుపు",
            hi: "लाल",
            kn: "ಕೆಂಪು",
            ta: "சிவப்பு",
            mr: "लाल",
            gu: "લાલ",
          },
          {
            en: "Laterite",
            te: "లేటరైట్",
            hi: "लेटराइट",
            kn: "ಲೇಟರೈಟ್",
            ta: "லேட்டரைட்",
            mr: "लेटराइट",
            gu: "લેટરાઇટ",
          },
          {
            en: "Alluvial",
            te: "ఒండ్రు",
            hi: "जलोढ़",
            kn: "ಅಲ್ಯೂವಿಯಲ್",
            ta: "அலுவியல்",
            mr: "गाळ",
            gu: "એલ્યુવિયલ",
          },
        ],
      }
    );
  }

  return questions;
};

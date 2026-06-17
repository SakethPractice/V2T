import { Question } from "../../types/questions"

export const farmerQuestions: Question[] = [
    {
        id: "name",
        section: "farmer",
        field: "farmer.name",
        question: "What is your full name?",
        type: "text",
        required : true,
        minLength : 1,
    },

    {
        id: "DOB",
        section: "farmer",
        field: "farmer.DOB",
        question: "What is your date of birth?",
        type: "date",
        required : true,

    },
    
    {
        id: "gender",
        section: "farmer",
        field: "farmer.gender",
        question: "What is your gender?",
        type: "select",
        required : true,
        options: ["Male", "Female", "Other"],
    },

    {
        id: "mobile_num",
        section: "farmer",
        field: "farmer.mobile_num",
        question: "What is your mobile number?",
        type: "text",
        required : true,
        minLength : 10,
        maxLength : 10,
        pattern: /^[6-9]\d{9}$/, 
    },

    {
        id: "village",
        section: "farmer",
        field: "farmer.village",
        question: "Which village do you live in?",
        type: "text",
        required : true,
        minLength : 2,
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
        id : "farmer_photo",
        section : "farmer",
        field : "farmer.photo",
        question : "Capture photo of the farmer",
        type : "image",
        required : true,
    },
];
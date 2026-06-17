import { Question } from "../../types/questions";

export const farmQuestions: Question[] = [
    {
        id: "farm_name",
        section: "farm",
        field: "farm.name",
        question: "What is the name of the farm?",
        type: "text",
        required : true,
        minLength : 1,
    },

    {
        id: "farm_address",
        section: "farm",
        field: "farm.address",
        question: "Where is the farm?",
        type: "text",
        required : true,
        minLength : 4,
    },

    {
        id: "farm_Tarea",
        section: "farm",
        field: "farm.Tarea",
        question: "How big is your farm?",
        type: "number",
        required : true,
        min: 0.5,
    },

    {
        id: "farm_Uarea",
        section: "farm",
        field: "farm.Uarea",
        question: "How much is being used?",
        type: "number",
        required : true,
    },

    {
        id: "farm_area_unit",
        section: "farm",
        field: "farm.unit",
        question: "What is the unit of measurement?",
        type: "select",
        required: true,
        options: ["Hectare", "Acre", "Square Meter", "Square Foot", "Bigha"],
    },

    {
        id: "farm_type",
        section: "farm",
        field: "farm.type",
        question: "What type of farming do you practice?",
        type: "select",
        required: true,
        options: ["Crop", "Horticulture", "Mixed", "Organic"],
    },

    {
        id: "farm_watersrc",
        section: "farm",
        field: "farm.watersrc",
        question: "How do you water your farm?",
        type: "text",
        required : true,
    },

    {
        id: "farm_soil",
        section: "farm",
        field: "farm.soil",
        question: "What type of soil is present in your farm?",
        type: "text",
        required : true,
    },

    {
        id: "farm_blockCount",
        section: "farm",
        field: "farm.blockCount",
        question: "How many blocks are present in your farm?",
        type: "number",
        required : true,
        min : 1,
        max : 20,
    },

    {
        id : "farm_photo",
        section : "farm",
        field : "farm.photo",
        question : "Capture photo of the farm",
        type : "image",
        required : true,
    },
]
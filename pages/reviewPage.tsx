import { useInterviewStore } from "../state/interviewStore";

export default function ReviewPage() {
  const { responses } = useInterviewStore();

  console.log(responses);

    return (
  <div>
    <h1>Review Page</h1>

    <h2>Farmer Information</h2>

    <p>Name: {responses.farmer.name}</p>
    <p>DOB: {responses.farmer.DOB}</p>
    <p>Gender: {responses.farmer.gender}</p>
    <p>Mobile: {responses.farmer.mobile_num}</p>
    <p>Village: {responses.farmer.village}</p>
    <p>Pincode: {responses.farmer.pincode}</p>
  
  <div>
        <h2>Farm Information</h2>
        <p>Farm Name : {responses.farm.name}</p>
        <p>Farm Tarea : {responses.farm.Tarea}</p>
        <p>Farm Uarea : {responses.farm.Uarea}</p>
        <p>Farm unit : {responses.farm.unit}</p>
        <p>Farm Block count : {responses.farm.blockCount}</p>
        <p>Farm soil : {responses.farm.soil}</p>
        <p>Farm add : {responses.farm.address}</p>
        <p>Farm type : {responses.farm.type}</p>
        <p>Farm watersrc : {responses.farm.watersrc}</p>
        <p>Farm photo : {responses.farm.photo}</p>
  </div>

  </div>
);

}

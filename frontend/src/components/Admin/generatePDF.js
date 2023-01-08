import jsPDF from "jspdf";
import "jspdf-autotable";

// define a generatePDF function that accepts a tickets argument
const generatePDF = (foodrequests) => {
  // initialize jsPDF
  const doc = new jsPDF();

  // define the columns we want and their titles
  const tableColumn = ["Id", "Title", "Donor", "Ngo", "Quantity", "DateTime", "City"];
  // define an empty array of rows
  const tableRows = [];

  // for each ticket pass all its data into an array
  foodrequests.forEach(foodrequest => {
    const requestData = [
      foodrequest.id,
      foodrequest.food_name,
      foodrequest.donor_name,
      foodrequest.ngo_name,
      foodrequest.quantity,
      foodrequest.date_time,
      foodrequest.city_name
    ];
    // push each tickcet's info into a row
    tableRows.push(requestData);
  });


  // startY is basically margin-top
  doc.autoTable(tableColumn, tableRows, { startY: 50 });
  const date = Date().split(" ");
  // we use a date string to generate our filename.
  const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
  // ticket title. and margin-top + margin-left
  doc.text("Report", 14, 15)
  doc.text("Completed food requests within the last one month.", 14, 25);
  doc.text("Area: "+foodrequests[0]['area_name'], 14, 35);
  // we define the name of our PDF file.
  doc.save(`report_${dateStr}.pdf`);
};

export default generatePDF;
// main.ts
/**
 * @author Kevin Bravo <@kevbto> <bravokevinto@gmail.com>
 * @module 
 */

/**
 * 
 */
type WorkshopFinalData = {
  workshop: Workshop;
  formUrl: string;
  completeFormUrl: string;
}
/**
 * The column from where we grab the meeting url of a workshop
 */
const COLUMN_FOR_MEETING_URL = 'Q'

/**
 * Sets the meeting url asociated to an specific workhop in the main spreadsheet 
 * 
 * @param rangeNumber the range of the especific workshop data row in a sheet
 * @param meetingUrl the meeting url 
 */
const setMeetUrl = (rangeNumber: number, meetingUrl: string) => {
  const rangeName = `${COLUMN_FOR_MEETING_URL}${rangeNumber}`
  const cell = sheet.getRange(rangeName)
  cell.setValue(meetingUrl)
}

/**
 * Sets an event in the calendar and gets the meeting created for that event and the 'add to my calendar' link
 * 
 * @param workshop the data of a workshop
 * @returns the meeting link and the 'add to my calendar' link
 */
const calendarMain = (workshop: Workshop) => {
  const eventId = createEvent(workshop)
  const meetLink = getMeetEventLink(eventId!);
  const addUrl = getPublicEventLink(eventId!);
  return [meetLink, addUrl]
}

const sendScheduledWorkshops = () => {
  const workshopsData = scriptProperties.getProperty(SCRIPT_PROPERTIES_WORKSHOPS_KEY)
  const allWorkshops = JSON.parse(workshopsData!)
}


/**
 * Gets and process all the data and send the emails 
 * 
 * @param subject the subject of the email
 * @param groupName the contact group name to which we want to send the email
 */
const main = (subject: string, groupName: string) => {
  //getting all the necessarie values
  const workshopsValuesArr = getWorkshopsDetails();
  const processedWorkshopData = processData(workshopsValuesArr!);
  const [scheduledWOrkshops, workshopsToSendASAP] = processWorkshopType(processedWorkshopData);

  const workshopsToSendASAPFinalDataArr: WorkshopFinalData[] = []
  const scheduledWOrkshopsFinalArr = []

  //if there are workshops to schedule, store them in `Properties Services`
  if (scheduledWOrkshops.length >= 1) {
  }
  //if there are workshops to send ASAP
  if (workshopsToSendASAP.length >= 1) {
    workshopsToSendASAP.forEach(w => {
      //@ts-ignore
      const workshopsToSendASAPFinalDataObj: WorkshopFinalData = {}
      const [meetLink, addUrl] = calendarMain(w);
      setMeetUrl(w.id, meetLink);
      workshopsToSendASAPFinalDataObj.workshop = w;
      [workshopsToSendASAPFinalDataObj.formUrl, workshopsToSendASAPFinalDataObj.completeFormUrl] = createForm(w, addUrl);
      workshopsToSendASAPFinalDataArr.push(workshopsToSendASAPFinalDataObj)

    })
    sendEmails(workshopsToSendASAPFinalDataArr, subject, groupName);
  }
  //se update el rango d ela verga esta
  // updateSheetRange()
}
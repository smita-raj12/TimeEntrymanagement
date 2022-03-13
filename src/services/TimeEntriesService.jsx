import http from "./httpServices";

const apiEndpoint = "/timeEntry";

function timeEntryUrl(id) {
  return `${apiEndpoint}/${id}`;
}

function timeEntryUrlEmailId(email) {
  return `${apiEndpoint}/email/${email}`;
}

function timeEntryUrlMaxId() {
  return "/maxTimeEntry";
}

export function getTimeEntries() {
    return http.get(apiEndpoint);
}

export function getTimeEntryMaxId() {
  return http.get(timeEntryUrlMaxId());
}

export function getTimeEntryEmailId(email) {
  return http.get(timeEntryUrlEmailId(email));
}

export function getTimeEntry(timeEntryId) {
  return http.get(timeEntryUrl(timeEntryId));
}

export function saveTimeEntry(timeEntry) {

  if (!timeEntry.formType.startsWith("New")) {
    const body = { ...timeEntry };
    delete body._id;
    delete body.formType;
    delete body.week;
    delete body.workOrderDesc;
    return http.put(timeEntryUrl(timeEntry._id), body);
  } else {
    const body = { ...timeEntry };

    delete body.formType;
    delete body._id;
    delete body.week;
    delete body.workOrderDesc;
    return http.post(apiEndpoint, body);
  }
  
}

export function deleteTimeEntry(id) {
  return http.delete(timeEntryUrl(id));
}
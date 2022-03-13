import React from "react";
import Joi from "joi-browser";
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from "../common/Form";
import moment from "moment";
import { getWorkOrders } from "../services/WorkOrderService";


class TimeEntryForm extends Form {
    state = {
        data: { date: moment(moment(), "YYYY-MM-DD").subtract(3, "months").format("YYYY-MM-DD"),
        workOrderId: 0, week: 0, hours: 0, emailId: 0,formType:" " },
        workOrders: [],
        timeEntries: [],
        errors: {},
    };
    
    schema = {
        _id: Joi.number(),
        date: Joi.date()
            .max(moment().add(3, "months").format("YYYY-MM-DD"))
            .min(moment().subtract(3, "months").format("YYYY-MM-DD"))
            .required()
            .label("Date"),
        week: Joi.number(),
        workOrderId: Joi.number().label("WorkOrderId"),
        emailId: Joi.number().label("emailId"),
        hours: Joi.number().min(1).max(24),
        formType: Joi.string().max(24).required()
    };

    async populateWorkOrder() {
        const { data:workOrders }  =  await getWorkOrders();
        this.setState({ workOrders });
    }
    
    populateTimeEntry() {
        const { timeEntry } = this.props;
        this.setState({ data: this.mapToViewModel(timeEntry) });
    }
    
    populateTimeEntries() {
        const { timeEntries } = this.props;
        this.setState({ timeEntries });
    }
    
    componentDidMount() {

        this.populateWorkOrder();
        this.populateTimeEntry();
        this.populateTimeEntries();
    }
    
    doSubmit = async () => {
        this.props.onSave(this.state.data);
    };

    handleSelect(workOrderId) {
        const {workOrders} = this.state
        var selectedWorkOrder = workOrders.filter(
            (m) => m._id === parseInt(workOrderId)
        );
        const selecteddescription = selectedWorkOrder.map((o) => o.description);
        return !workOrderId ? " " : selecteddescription;
    }

    mapToViewModel(TimeEntry) {
        return {
            _id: TimeEntry._id,
            date: TimeEntry.date,
            workOrderId: TimeEntry.workOrderId,
            emailId: TimeEntry.emailId,
            week: TimeEntry.week,
            hours: TimeEntry.hours,
            formType: TimeEntry.formType
        };
    }
    
    customValidation = (input) => {
        
        const { date } = this.state.data;
    
        var customError = " ";
        var totalHoursPerDay = 0;

        this.populateTimeEntries();
        const origionalTimeEntries = this.state.timeEntries;
       
        const timeEntriesForTheDate = origionalTimeEntries.filter(
            (m) => m.date === date
        );
    
        if (input.name === "hours") {
            totalHoursPerDay = input.value;
        }
    
        for (let i = 0; i < timeEntriesForTheDate.length; i++) {
            if (input.name === "workOrderId") {
                if (
                    timeEntriesForTheDate[i].date === date &&
                    timeEntriesForTheDate[i].workOrderId === input.value
                ) {
                    return (customError = "Duplicate work order ");
                }
            }
            if (input.name === "hours") {
                totalHoursPerDay =
                    parseInt(totalHoursPerDay) + timeEntriesForTheDate[i].hours;
                if (totalHoursPerDay > 24) {
                    return (customError = "Total hours per day can't be more than 24 ");
                }
            }
        }
        return customError > " " ? customError : null;
    };
    
    
    render() {
        const { timeEntry } = this.props;
        
        return (
            <div>
                {timeEntry.formType === "Summary" && (
                    <div className="row m-2" style={{backgroundColor: "rgb(84, 102, 150)"}}>
                        <div className="col-3 m-2" >{timeEntry.groupByColumn}</div>
                        <div className="col-6 m-2">=====================Total=========</div>
                        <div className="col m-2">{timeEntry.hours}</div>
                    </div>
                )}

                {timeEntry.formType !== "Summary"&& (  
                    <form onSubmit={this.handleSubmit}>
                        <div className="row m-2" style={{backgroundColor: "#9cf"}}>
                        <div className="mr-2"></div>

                            <div className="col-1 m-1">
                                {this.renderInput("week", "Week","text" ,"readOnly")}
                            </div>

                            <div className="col-2">
                                {this.renderInput("date", "Date","text" ,"readOnly")}
                            </div>

                            <div className="col-2">
                                {this.renderSelect(
                                    "workOrderId",
                                    "WorkOrder",
                                    this.state.workOrders
                                )}
                            </div>

                            <div className="col-4 mt-4">
                                {this.handleSelect(this.state.data.workOrderId)}
                            </div>

                            <div className="col-1">
                                {this.renderInput("hours", "Hours", "Number")}
                            </div>

                            <div className="col">{this.renderButton("Save")}</div>
                            
                            <div className="col">
                            <button 
                                onClick={() => this.props.onDelete(this.props.timeEntry)} disabled ={timeEntry.formType === "New"}
                                className="btn-danger btn-sm mt-3">
                                Delete
                            </button>
                            </div>
                        </div>
                    </form>
                )}   
            </div>
        );
    }    
} 


export default TimeEntryForm;
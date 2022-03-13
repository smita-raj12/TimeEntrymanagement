import React, { Component } from 'react'
import Table from "../common/Table";
import moment from 'moment';
import { getTimeEntries } from "../services/TimeEntriesService";
import 'bootstrap/dist/css/bootstrap.min.css';
import SelectBox from './SelectBox';
import { getWorkOrders } from '../services/WorkOrderService';
//import SearchIcon from '@material-ui/icons/Search';
import { getUsers } from '../services/registrationService';


class Controlers extends Component {

    state = {
        data: { date: "" },
        errors: {},
        timeEntries:[],
        workOrders: [],
        dateArray: [],
        weekArray:[],
        startDate: "2021-01-01",
        sortColumn: { path: "title", order: "Desc" },
        selectedWorkOrder: null,
        selectedDate: null,
        selectedWeek:null,
        selectedUserName:null,
        users : []
    };

    columns = [
        { path: "date", label: "Date" },
        { path: "workOrderName", label: "Work Order Number" },
        { path: "workOrderDesc", label: "Work Order Description" },
        { path: "hours", label: "Hours" },
        { path: "week", label: "Week" },
        { path: "userName", label: "userName" }
    ];

    async componentDidMount() {
        const {data:userdata} = await getUsers();
        const users = userdata  .map(o=>({
            _id : o.id,
            name: o.name,
         

        }))
        console.log("controlers users",users);
        const  { data: workOrders }  =  await getWorkOrders();
        const { data } = await getTimeEntries();
        const timeEntries = data.map(o=>({
            _id : o._id,
            userName:o.userName,
            week: moment(moment(o.date).format("YYYY-MM-DD")).week(),
            date: moment(o.date).format('YYYY-MM-DD'), 
            workOrderId: o.workOrderId,
            workOrderName : o.name, 
            workOrderDesc: o.description,
            hours: o.hours,
            formType: "data"
        }))
        
        var dateArray = [];
        var weekArray = [];
        let prevWeekNumber = [];
        let weekNumber = " ";
         
        var currentDate = moment(
            moment(moment(), "YYYY-MM-DD").subtract(90, "days").format("YYYY-MM-DD")
        );

        var startDate = moment(
            moment(moment(), "YYYY-MM-DD").subtract(90, "days").format("YYYY-MM-DD")
        );

        var stopDate = moment(
            moment(moment(), "YYYY-MM-DD").add(30, "days").format("YYYY-MM-DD")
        );

        var x = 0
        var y = 0

        while (currentDate <= stopDate) {

            dateArray.push({
                _id: x,
                name: moment(currentDate).format("YYYY-MM-DD"),
            });
            currentDate = moment(currentDate).add(1, "days");
            x = x + 1;
            weekNumber = moment(currentDate, "YYYY-MM-DD").week();
     
            if (weekNumber !== prevWeekNumber) {
                weekArray.push({
                    _id: y,
                    name: weekNumber,
                });
                prevWeekNumber = weekNumber;
                y = y +1;
            }
        }    
        this.setState({timeEntries, workOrders, dateArray, startDate,weekArray, users })
    } 

    handleSort = (sortColumn) => {
        this.setState({ sortColumn });
    };

    handleReset = () => {
        const selectedWorkOrder = null;
        const selectedDate = null;
        const selectedWeek = null;
        const selectedUserName = null;
        this.setState({ selectedWorkOrder, selectedDate, selectedWeek, selectedUserName });
    };

    handleWorkOrderSelect = (workOrder) => {
        this.setState({
            selectedWorkOrder: parseInt(workOrder),
        });
    };
    
    handleDateSelect = (date) => {
        const { dateArray } = this.state;
        const selectedDate = dateArray[date].name;
        this.setState({ selectedDate });
    };
    
    handleWeekSelect = (week) => {
        const { weekArray } = this.state;
        const selectedWeek = weekArray[week].name;
        this.setState({ selectedWeek});
    };
    
    handleUserSelect = (userName) => {
        console.log("user  ",userName)
        const {users}  = this.state 
        const selectedUserName = users[userName - 1].name;
        console.log("selectedUserName  ",selectedUserName)
        
        this.setState({
            selectedUserName:  selectedUserName,
        });
    };

    getPageData(){

        const { timeEntries,
                selectedWorkOrder,
                workOrders,
                startDate,
                selectedDate,
                selectedWeek,
                selectedUserName
            } = this.state
            
        const timeentriesWithinDateRange = timeEntries.filter((m) =>
            moment(m.date).isSameOrAfter(startDate)
        );
        
        var filtered = timeentriesWithinDateRange;

        if (selectedWorkOrder) {
            filtered = filtered.filter((m) => m.workOrderId === selectedWorkOrder);
                        
            workOrders
                .filter((o) => o._id === selectedWorkOrder)
                .map((o) => o.name).toString();
        }

        if (selectedDate) {
            filtered = filtered.filter((m) => m.date === selectedDate);
        }

        if (selectedWeek) {
            filtered = filtered.filter((m) => m.week === selectedWeek);
        }

        if (selectedUserName) {
            filtered = filtered.filter((m) => m.userName === selectedUserName);
        }
        return {data:filtered}
    } 

    render() {
        const  {data}  = this.getPageData();
        
        const { 
            sortColumn,  
            workOrders, 
            selectedWorkOrder,
            selectedDate,
            dateArray,
            weekArray,
            selectedWeek, 
            users,
            selectedUserName} = this.state;
    
        console.log("users",users)
        let selectedWorkOrder1 = " ";
        if (selectedWorkOrder){
            selectedWorkOrder1 = selectedWorkOrder;
        }

        const dateId = dateArray
            .filter((o) => o.name === selectedDate)
            .map((o) => o._id);
    
        const weekId = weekArray
            .filter((o) => o.name === selectedWeek)
            .map((o) => o._id);      
        
        return (
            <div>
                <div className="row">
                    <div className="col-1">
                        <button
                            onClick={this.handleReset}
                            className="btn-danger btn-sm mt-3"
                        >
                        Reset
                        </button>
                    </div>
                    <div className="col-2">
                        <SelectBox
                            name="User"
                            options={users}
                            value={selectedUserName}
                            onChange={this.handleUserSelect}
                        />
                    </div>
                    <div className="col-2">
                        <SelectBox
                            name="WorkOrderId"
                            options={workOrders}
                            value={selectedWorkOrder1}
                            onChange={this.handleWorkOrderSelect}
                        ></SelectBox>
                    </div>
                    <div className="col-2">
                        <SelectBox
                            name="Date"
                            options={dateArray}
                            value={dateId}
                            onChange={this.handleDateSelect}
                        />
                    </div>
                    <div className="col-1">
                        <SelectBox
                            name="Week"
                            options={weekArray}
                            value={weekId}
                            onChange={this.handleWeekSelect}
                        />
                    </div>
                </div>  
                <h4 style={{textAlign: "center", color:"red", paddingTop:"30px"}}>Showing data in the database table.</h4>          
                <Table
                    columns={this.columns}
                    data={data }
                    sortColumn={sortColumn}
                    onSort={this.handleSort}
                />
            </div>
        );
    }
}

export default Controlers;
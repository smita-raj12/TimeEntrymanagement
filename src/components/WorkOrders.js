import React, {Component} from 'react'
import WorkOrderForm from './WorkOrderForm'
import { getWorkOrders, saveWorkOrder , deleteWorkOrder} from '../services/WorkOrderService';
import { toast } from "react-toastify";

class WorkOrders extends Component {
  state = {
    workOrders: [],
    newWorkOrders : []
  };

  async componentDidMount() {
    const   { data: workOrders }   =  await getWorkOrders(); 
    
    workOrders.push({
      _id: 0,
      name: " ",
      description: " "
    })
    this.setState({workOrders})
  }

  handleSave =  async (workOrder) => {
    try {
      const { data: newWorkOrder } = await saveWorkOrder(workOrder);
      
      if (workOrder._id === 0) {
        const workOrders = this.state.workOrders;
        
        for (let i=0;i < workOrders.length;i++)
        {
          if (workOrders[i]._id === 0) 
          { 
            workOrders[i]=workOrder
            workOrders[i]._id=newWorkOrder.insertId
          }
        }
        workOrders.push({
            _id: newWorkOrder.insertId + 1 ,
            name: " ",
            description: " ",
        });
        this.setState({ workOrders });
      }  
    }catch (ex) {
      if (ex.response) console.log("ex.repsonse", ex.response);
    }
  }

  handleDelete = async (workOrder) => {
    const origionalworkOrders = this.state.workOrders;
    const workOrders = origionalworkOrders.filter(
        (m) => m._id !== workOrder._id
    );
    this.setState({ workOrders });
    
    try {
      await deleteWorkOrder(workOrder._id);
    } catch (ex) {
        console.log("HANDLE DELETE CATCH BLOCK");
        if (ex.response && ex.response.status === 404) toast.error("This post has already been deleted");
      this.setState({ workOrders: origionalworkOrders })
    }
  }
 
  render(){
    const {workOrders} = this.state
    
    return (
      
      <div> 
        <ul className="list-group">
          {workOrders.map((item) => {
            return <li  key={item._id}
            className="list-inline-item">     
            <WorkOrderForm 
              workOrder={item}
              onDelete={this.handleDelete}
              onSave={this.handleSave}
            /> 
            </li>
          })}
        </ul>   
      </div> 
    )
  }
}
export default WorkOrders
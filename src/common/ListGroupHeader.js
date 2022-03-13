import React, { Component } from "react";

class ListGroupHeader extends Component {
    raiseSort = (path) => {
        const sortColumn = { ...this.props.sortColumn };
        console.log("listgroup sort column", sortColumn, path);
        if (sortColumn.path === path)
            sortColumn.order = (sortColumn.order === "asc") ? "desc" : "asc";
        else {
            sortColumn.path = path;
            sortColumn.order = "asc";
        }
        this.props.onSort(sortColumn);
    };

    renderSortIcon = (column) => {
        const { sortColumn } = this.props;
        if (column.path !== sortColumn.path) return null;
        if (sortColumn.order === "asc") return <i className="fa fa-sort-down "/>;
        return <i className="fa fa-sort-up"></i>;    
    };

    render() {
        return (
            <div className="row bg-secondary text-white m-2 " >
                {this.props.columns.map((column) => (
                <div
                    className={this.getColumnClasses(column.width)}
                    key={column.path || column.key}
                    onClick={() => this.raiseSort(column.path)}
                >
                    {column.label} {this.renderSortIcon(column)}
                </div>
                ))}
            </div>
        );
    }

    getColumnClasses(width) {
        let classes = "clickable col-";
        classes += width;
        return classes;
    }
}

export default ListGroupHeader;
package main.guiFrames;

import java.sql.ResultSet;
import java.sql.SQLException;

import javax.swing.table.DefaultTableModel;

import java.util.ArrayList;

/**
 * This class implements list refinements on the GUI event table
 * 
 * @author Ward Mattar
 */
public class RefineTable {
	private ArrayList<String> fields;

	public ArrayList<String> getFields() {
		return fields;
	}

	public void addField(String name) {
		if (name != null && !"".equals(name))
			fields.add(name);
	}

	public void removeField(String name) {
		if (fieldExist(name))
			fields.remove(name);
	}

	public boolean fieldExist(String name) {
		return name != null && !"".equals(name) && fields.contains(name);
	}

	/**
	 *
	 * accepts a DefaultTableModel and list of events as a SQL query result and fills them
	 * in table
	 * 
	 * @throws SQLException
	 */
	public void fillEventsTable(DefaultTableModel m, ResultSet s) throws SQLException {
		if (m == null || s == null)
			return;
		for (int ¢ = 0; ¢ < m.getRowCount(); ++¢)
			m.removeRow(¢);
		for (Object tempEvent[] = new Object[3]; s.next();) {
			tempEvent[0] = s.getObject("Name");
			tempEvent[1] = s.getObject("Date");
			tempEvent[2] = s.getObject("Reason");
			m.addRow(tempEvent);
		}
	}

	/**
	 * sorts the content of the events table according to the given field name
	 */
	public void sortBy(DefaultTableModel m, String fieldName) {
		if (m == null || !fieldExist(fieldName))
			return;
		switch (fieldName) {
		case "Date":
			// TODO: call fillTable with
			// the result of runQuery("SELECT * FROM events ORDER BY
			// UNIX_TIMESTAMP(date) DESC")
			break;
		case "Name":
			// TODO: call fillTable with
			// the result of runQuery("SELECT * FROM events ORDER BY name DESC")
			break;
		case "Reason":
			// TODO: call fillTable with
			// the result of runQuery("SELECT * FROM events ORDER BY reason")
			break;
		}

	}

	/**
	 * filters the content of the events table according to the given field name
	 * and value
	 */
	public void filterBy(DefaultTableModel m, String fieldName, String fieldValue) {
		if (m == null || !fieldExist(fieldName) || fieldValue == null)
			return;
		switch (fieldName) {
		case "Date":
			// TODO: call fillTable with
			// the result of runQuery("SELECT * FROM events WHERE DATE(date) = " + fieldValue + " ")
			break;
		case "Name":
			// TODO: call fillTable with
			// the result of runQuery("SELECT * FROM events WHERE name = " + fieldValue + " ")
			break;
		case "Reason":
			// TODO: call fillTable with
			// the result of runQuery("SELECT * FROM events WHERE name LIKE \"%" + fieldValue + "%\"")
			break;
		}

	}

	public RefineTable() {
		fields = new ArrayList<String>();
	}
}
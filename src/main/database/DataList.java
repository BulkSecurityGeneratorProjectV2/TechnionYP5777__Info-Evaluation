package main.database;

import java.util.ArrayList;
import java.util.Iterator;

/**
 * 
 * @author netanel This class holds all the data to be shown in the table in the
 *         GUI
 * @author osherh       
 */
public class DataList implements Iterable<TableTuple>{
	private ArrayList<TableTuple> list;
	private int numOfTuples;

	@Override
	public Iterator<TableTuple> iterator(){
		return list.iterator();
	}
	
	public DataList() {
		this.list = new ArrayList<>();
		this.numOfTuples = 0;
	}

	public void insert(String name, String date, String reason) {
		this.list.add(new TableTuple(name, date, reason));
		++this.numOfTuples;
	}

	public void insert(TableTuple ¢) {
		this.list.add(¢);
		++this.numOfTuples;
	}

	public int getNumOfTuples() {
		return this.numOfTuples;
	}

	public ArrayList<TableTuple> getList() {
		return this.list;
	}
	// if needed, we can implement here sorts, refines etc.
}

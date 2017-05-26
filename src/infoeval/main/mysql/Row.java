package infoeval.main.mysql;

import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Date;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Time;
import java.sql.Timestamp;
import java.util.AbstractMap;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * @author Adam Dziedzic
 * 
 */
public class Row implements Serializable {
	public List<Entry<Object, Class>> row;
	public static Map<String, Class> TYPE;

	static {
		TYPE = new HashMap<String, Class>();

		TYPE.put("INTEGER", Integer.class);
		TYPE.put("TINYINT", Byte.class);
		TYPE.put("SMALLINT", Short.class);
		TYPE.put("BIGINT", Long.class);
		TYPE.put("REAL", Float.class);
		TYPE.put("FLOAT", Double.class);
		TYPE.put("DOUBLE", Double.class);
		TYPE.put("DECIMAL", BigDecimal.class);
		TYPE.put("NUMERIC", BigDecimal.class);
		TYPE.put("BOOLEAN", Boolean.class);
		TYPE.put("CHAR", String.class);
		TYPE.put("VARCHAR", String.class);
		TYPE.put("LONGVARCHAR", String.class);
		TYPE.put("DATE", Date.class);
		TYPE.put("TIME", Time.class);
		TYPE.put("TIMESTAMP", Timestamp.class);
		TYPE.put("SERIAL", Integer.class);
		TYPE.put("INT", Integer.class);
		// ...
	}

	public Row() {
		row = new ArrayList<Entry<Object, Class>>();
	}

	public <T> void add(T data) {
		row.add(new AbstractMap.SimpleImmutableEntry<Object, Class>(data, data.getClass()));
	}

	public void add(Object data, String sqlType) {
		Class castType = Row.TYPE.get(sqlType.toUpperCase());
		try {
			this.add(castType.cast(data));
		} catch (NullPointerException e) {
			e.printStackTrace();
			Logger lgr = Logger.getLogger(Row.class.getName());
			lgr.log(Level.SEVERE,
					e.getMessage() + " Add the type " + sqlType + " to the TYPE hash map in the Row class.", e);
			throw e;
		}
	}

	public static void formTable(ResultSet s, List<Row> table) throws SQLException {
		if (s == null)
			return;

		ResultSetMetaData rsmd;
		try {
			rsmd = s.getMetaData();

			for (int NumOfCol = rsmd.getColumnCount(); s.next();) {
				Row current_row = new Row();
				for (int ¢ = 1; ¢ <= NumOfCol; ++¢)
					current_row.add(s.getObject(¢), rsmd.getColumnTypeName(¢));
				table.add(current_row);
			}
		} catch (SQLException e) {
			throw e;
		}
	}
}
package infoeval.test.WikiDataTest;

import static org.junit.Assert.*;

import org.junit.Ignore;
import org.junit.Test;
import infoeval.main.WikiData.Connector;
import infoeval.main.WikiData.Extractor;
import infoeval.main.WikiData.QueryTypes;
import infoeval.main.mysql.Row;

import java.sql.Connection;
import java.util.ArrayList;
import java.util.Map.Entry;

/**
 * @author Netanel
 * @author osherh
 * @since 19-04-2017
 */
public class ConnectorTest {
	private static final int ENTRIES_NUM = 10000;
	
	/*
	 * ATTENTION ! When you want to test this class , remove the @ignore attributes.
	 * I added it becasue connector tries to read from the config.xml file which won't be uploaded to GitHub and it causes
	 * travisCI to fail. 
	 * @Moshiko 
	 */
	@Ignore
	@Test
	public void connectionTest() throws Exception {
		Connector conn = new Connector();
		Connection connection = conn.getConnection();
		assert connection != null;
		connection.close();
	}
	@Ignore
	@Test
	public void basicInfoTableSizeTest() throws Exception {
		Connector conn = new Connector();
		assert conn.getConnection() != null;

		ArrayList<Row> rows = conn.runQuery("SELECT COUNT(*) FROM basic_info");
		Row row = rows.get(0);
		Entry<Object, Class> col = row.row.get(0);
		Object size = col.getValue().cast(col.getKey());

		assertEquals(ENTRIES_NUM, size);

		Extractor ext = new Extractor();
		ext.executeQuery(QueryTypes.BASIC_INFO);
		assertEquals(ext.getResults().size(), size);
		
		conn.close();
	}
	
	@Ignore
	@Test
	public void wikiIdTableSizeTest() throws Exception {
		Connector conn = new Connector();
		assert conn.getConnection() != null;
		
		ArrayList<Row> rows = conn.runQuery("SELECT COUNT(*) FROM WikiID");
		Row row = rows.get(0);
		Entry<Object, Class> col = row.row.get(0);
		Object size = col.getValue().cast(col.getKey());

		assertEquals(ENTRIES_NUM, size);

		Extractor ext = new Extractor();
		ext.executeQuery(QueryTypes.WIKI_ID);
		assertEquals(ext.getResults().size(), size);
		
		
		conn.close();
	}
}
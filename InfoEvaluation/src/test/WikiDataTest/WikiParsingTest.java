package WikiDataTest;
import java.io.IOException;

/**
 * 
 * @author moshiko
 * @since  05-04-2017
 * 
 * 
 */


import org.junit.Test;
import WikiData.WikiParsing;
public class WikiParsingTest {
	@Test
	public void test1() throws IOException{

		System.out.print((new WikiParsing("https://en.wikipedia.org/wiki/Axl_Rose")).Parse("arrested"));

	}
	
	

}

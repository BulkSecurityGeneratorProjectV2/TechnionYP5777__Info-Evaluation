package main.guiFrames;


import java.awt.Color;
import java.awt.Dimension;
import java.awt.EventQueue;
import java.awt.Toolkit;
import java.sql.SQLException;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JMenu;
import javax.swing.JMenuBar;
import javax.swing.JMenuItem;
import javax.swing.JOptionPane;
import javax.swing.JTable;
import javax.swing.JTextField;
import javax.swing.border.LineBorder;
import javax.swing.table.DefaultTableModel;
import javax.swing.GroupLayout;
import javax.swing.GroupLayout.Alignment;
import javax.swing.LayoutStyle.ComponentPlacement;
import javax.swing.JCheckBox;
import main.database.MySQLConnector;
import javax.swing.JComboBox;
import javax.swing.JTextPane;


/**
 * This class implements the main windows of the GUI
 * @author viviansh
 */
 
public class MainFrame {

	private JFrame frame;
	private JTextField searchTxt;
	private JTable table;
	private JButton btnSearch;
	private RefineTable inputList;
	private JCheckBox chckbxName;
	private JCheckBox chckbxDate;
	private JCheckBox chckbxReason;
	private JMenuItem mntmAbout;
	private JMenu mnHelp;
	private JCheckBox chckbxSortby;
	private JCheckBox chckbxFilterBy;
	private  static MySQLConnector connector;
	private JComboBox <String> comboBox;
	private JTextPane txtpnChooseOneFrom;
	/**
	 * Launch the application.
	 */
	public static void main(String[] args) {
		EventQueue.invokeLater(new Runnable() {
			@Override
			public void run() {
				try {
					MainFrame window = new MainFrame();
					window.frame.setVisible(true);
					window.onClickCheckBox(window.chckbxDate, window.chckbxName, window.chckbxReason);
					window.onClickCheckBox(window.chckbxName, window.chckbxDate, window.chckbxReason);
					window.onClickCheckBox(window.chckbxReason, window.chckbxName, window.chckbxDate);
					
					window.chckbxSortby.addActionListener(l->{
						window.removeSelected();
						window.comboBox.setVisible(false);
						window.txtpnChooseOneFrom.setVisible(false);
						window.chckbxFilterBy.setSelected(false);
						window.chckbxDate.setText("Date");
window.setVisabilty(window.chckbxSortby.isSelected());
						
					});
					
					window.chckbxFilterBy.addActionListener(l->{
						window.removeSelected();
						window.comboBox.setVisible(false);
						window.txtpnChooseOneFrom.setVisible(false);
						window.chckbxSortby.setSelected(false);
						window.chckbxDate.setText("Year");
window.setVisabilty(window.chckbxFilterBy.isSelected());
					});
					
					window.btnSearch.addActionListener(e -> {
							DefaultTableModel model = (DefaultTableModel) window.table.getModel();
							if(window.chckbxSortby.isSelected())	
							try{
							window.inputList.sortBy(connector, model, window.selected_chckbx());
							}
							catch (SQLException exc) {
								JOptionPane.showMessageDialog(null, "problem with sql connector","Error", JOptionPane.INFORMATION_MESSAGE);
							}
							if (!window.chckbxFilterBy.isSelected())
								try {
									window.inputList.sortBy(connector, model, "none");
								} catch (SQLException e1) {
									e1.printStackTrace();
								}
							else
								try {
									window.inputList.filterBy(connector, (DefaultTableModel) window.table.getModel(),
											window.selected_chckbx(), (String) window.comboBox.getSelectedItem());
								} catch (SQLException e1) {
									e1.printStackTrace();
								}
								
							window.table.setVisible(true);	
					});
					window.mntmAbout.addActionListener(m->{
						JOptionPane.showMessageDialog(null,
								("Info Evaluation is a program that reads query results from google search and parses "
										+ "the data,formats it,\nthen analyzes according to the query "
										+ "and returns a structured list of info and interactively suggests"
										+ " new\nqueries in order to achieve the most exact results. "
										+ "\n\n\n\n\nBy: \nVivian Shehadeh\nGenia Shandalov\nOsher Hajaj"
										+ "\nWard Mattar\nMoshiko Elisof\nNetanel Felcher\n"),
								"About", JOptionPane.INFORMATION_MESSAGE);
						
					});
					
				} catch (Exception e) {
					e.printStackTrace();
				}
				finally{
					connector.closeConnection();
				}
				
			}
		});
		
	}

	protected void removeSelected() {
		this.chckbxName.setSelected(false);
		this.chckbxReason.setSelected(false);
		this.chckbxDate.setSelected(false);
		
	}
	protected void setVisabilty(boolean flag) {
		this.chckbxName.setVisible(flag);
		this.chckbxReason.setVisible(flag);
		this.chckbxDate.setVisible(flag);
		
	}

	/**
	 * Create the application.
	 */
	public MainFrame() {
		initialize();
	}

	/**
	 * Initialize the contents of the frame.
	 */
	private void initialize() {
		frame = new JFrame();
		frame.setTitle("Info Evaluation");
		frame.setResizable(false);
		Dimension screen = Toolkit.getDefaultToolkit().getScreenSize();
		frame.setBounds(0, 0,screen.width/2,screen.height/2);
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		
		try{
		connector = new MySQLConnector();
		}
		catch (Exception e){
			JOptionPane.showMessageDialog(null, "problem2 with sql connector","Error", JOptionPane.INFORMATION_MESSAGE);
		}
		JMenuBar menuBar = new JMenuBar();
		frame.setJMenuBar(menuBar);


		mnHelp = new JMenu("Help");
		menuBar.add(mnHelp);

		mntmAbout = new JMenuItem("About");
		mnHelp.add(mntmAbout);
		/*
		 * 
		 * initializing the table
		 * 
		 */
		table = new JTable();
		table.setShowVerticalLines(false);
		table.setCellSelectionEnabled(true);
		table.setColumnSelectionAllowed(true);
		table.setBorder(new LineBorder(null));
		for (int count = 1; count <= 10; ++count)
			table.setModel(new DefaultTableModel(new Object[][] { { "Name", "Date", "Reason" } },
					new String[] { "name", "date", "Reason" }));
		table.setBounds(30, 120, 400, 200);
		frame.getContentPane().add(table);
		table.setVisible(false);
		
		
		/*
		 * initializing the table
		 * 
		 */
		 inputList = new RefineTable();
		 inputList.addField("Date");
		 inputList.addField("Name");
		 inputList.addField("Reason");
		
		

		btnSearch = new JButton("Search");

		searchTxt = new JTextField();
		searchTxt.setText("Search");
		searchTxt.setColumns(10);

		 chckbxName = new JCheckBox("Name");
		 chckbxName.setVisible(false);

		 chckbxDate = new JCheckBox("Date");
		 chckbxDate.setVisible(false);
		 
		 chckbxReason= new JCheckBox("Reason");
		 chckbxReason.setVisible(false);
		 
		 
		 chckbxSortby = new JCheckBox("Sort by");
		
		 chckbxFilterBy = new JCheckBox("Filter by");
		
		comboBox = new JComboBox<String>();
		comboBox.setVisible(false);
		
		txtpnChooseOneFrom = new JTextPane();
		txtpnChooseOneFrom.setText("Choose one from:");
		txtpnChooseOneFrom.setBackground(new Color(0,0,0,0));
		txtpnChooseOneFrom.setVisible(false);
		
		GroupLayout groupLayout = new GroupLayout(frame.getContentPane());
		groupLayout.setHorizontalGroup(
			groupLayout.createParallelGroup(Alignment.LEADING)
				.addGroup(groupLayout.createSequentialGroup()
					.addGroup(groupLayout.createParallelGroup(Alignment.TRAILING, false)
						.addGroup(groupLayout.createSequentialGroup()
							.addContainerGap()
							.addComponent(searchTxt, GroupLayout.PREFERRED_SIZE, 434, GroupLayout.PREFERRED_SIZE))
						.addGroup(groupLayout.createSequentialGroup()
							.addGap(24)
							.addGroup(groupLayout.createParallelGroup(Alignment.LEADING)
								.addComponent(chckbxSortby)
								.addComponent(chckbxName))
							.addPreferredGap(ComponentPlacement.UNRELATED)
							.addGroup(groupLayout.createParallelGroup(Alignment.LEADING)
								.addGroup(groupLayout.createSequentialGroup()
									.addComponent(chckbxDate)
									.addPreferredGap(ComponentPlacement.RELATED)
									.addComponent(chckbxReason))
								.addComponent(chckbxFilterBy))
							.addPreferredGap(ComponentPlacement.RELATED, GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
							.addComponent(txtpnChooseOneFrom, GroupLayout.PREFERRED_SIZE, GroupLayout.DEFAULT_SIZE, GroupLayout.PREFERRED_SIZE)))
					.addGap(18)
					.addGroup(groupLayout.createParallelGroup(Alignment.LEADING, false)
						.addComponent(comboBox, 0, GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
						.addComponent(btnSearch, GroupLayout.DEFAULT_SIZE, 153, Short.MAX_VALUE))
					.addGap(63))
		);
		groupLayout.setVerticalGroup(
			groupLayout.createParallelGroup(Alignment.LEADING)
				.addGroup(groupLayout.createSequentialGroup()
					.addGap(20)
					.addGroup(groupLayout.createParallelGroup(Alignment.BASELINE)
						.addComponent(searchTxt, GroupLayout.PREFERRED_SIZE, 31, GroupLayout.PREFERRED_SIZE)
						.addComponent(btnSearch, GroupLayout.PREFERRED_SIZE, 33, GroupLayout.PREFERRED_SIZE))
					.addGroup(groupLayout.createParallelGroup(Alignment.LEADING)
						.addGroup(groupLayout.createSequentialGroup()
							.addGap(4)
							.addGroup(groupLayout.createParallelGroup(Alignment.BASELINE)
								.addComponent(chckbxSortby)
								.addComponent(chckbxFilterBy))
							.addPreferredGap(ComponentPlacement.UNRELATED)
							.addGroup(groupLayout.createParallelGroup(Alignment.LEADING)
								.addComponent(chckbxName)
								.addGroup(groupLayout.createParallelGroup(Alignment.BASELINE)
									.addComponent(chckbxDate)
									.addComponent(chckbxReason))))
						.addGroup(groupLayout.createSequentialGroup()
							.addGap(18)
							.addGroup(groupLayout.createParallelGroup(Alignment.TRAILING)
								.addComponent(txtpnChooseOneFrom, GroupLayout.PREFERRED_SIZE, GroupLayout.DEFAULT_SIZE, GroupLayout.PREFERRED_SIZE)
								.addComponent(comboBox, GroupLayout.PREFERRED_SIZE, GroupLayout.DEFAULT_SIZE, GroupLayout.PREFERRED_SIZE))))
					.addContainerGap(246, Short.MAX_VALUE))
		);
		frame.getContentPane().setLayout(groupLayout);

	}
	
	public void onClickCheckBox(JCheckBox chckbx,JCheckBox clearbx1,JCheckBox clearbx2){
		chckbx.addActionListener(l->{
			if(chckbx.isSelected()){
				clearbx1.setSelected(false);
				clearbx2.setSelected(false);
			}
			if (!this.chckbxFilterBy.isSelected() || !chckbx.isSelected()){
				this.comboBox.setVisible(false);
				this.txtpnChooseOneFrom.setVisible(false);
			}
			else {
				try {
					this.inputList.getCategory(connector, this.comboBox, chckbx.getName());
				} catch (SQLException e) {
					e.printStackTrace();
				}
				this.comboBox.setVisible(true);
				this.txtpnChooseOneFrom.setVisible(true);
			}
			
		});
	}
	public String selected_chckbx(){
		return chckbxName.isSelected() ? "Name"
				: chckbxDate.isSelected() ? "Date" : !chckbxReason.isSelected() ? "None" : "Reason";
	}
}
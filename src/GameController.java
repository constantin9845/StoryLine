import javax.swing.*;

public class GameController {
    private JFrame frame;
    private MainMenu mainMenu;
    private GamePanel gamePanel;
    private ProgressPanel progressPanel;

    public GameController() {
        frame = new JFrame("Xiao Yang the Time Traveller") ;
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(800, 600);
        frame.setLocationRelativeTo(null);
        frame.setResizable(false);

        mainMenu = new MainMenu(this);
        frame.setContentPane(mainMenu);
        frame.setVisible(true);
    }

    public void showMainMenu() {
        frame.setContentPane(mainMenu);
        frame.revalidate();
        frame.repaint();
    }

    public void startGame() {
        gamePanel = new GamePanel(this);
        frame.setContentPane(gamePanel);
        frame.revalidate();
        frame.repaint();
    }

    public void showProgress() {
        progressPanel = new ProgressPanel(this);
        frame.setContentPane(progressPanel);
        frame.revalidate();
        frame.repaint();
    }

    public void exitGame() {
        System.exit(0);
    }
}

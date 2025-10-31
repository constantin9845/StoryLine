import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

public class GamePanel extends JPanel {
    private GameController controller;

    public GamePanel(GameController controller) {
        this.controller = controller;
        setBackground(Color.DARK_GRAY);

        JButton backButton = new JButton("Back to Menu");
        backButton.addActionListener(e -> controller.showMainMenu());

        add(new JLabel("<html><font color='white' size='5'>Level 1: The Beginning</font></html>"));
        add(backButton);
    }
}

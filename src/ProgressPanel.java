import javax.swing.*;
import java.awt.*;

public class ProgressPanel extends JPanel {
    public ProgressPanel(GameController controller) {
        setBackground(Color.GRAY);
        setLayout(new BorderLayout());

        JLabel progressLabel = new JLabel("Your Progress (coming soon...)", SwingConstants.CENTER);
        progressLabel.setFont(new Font("SansSerif", Font.BOLD, 24));
        progressLabel.setForeground(Color.WHITE);

        JButton backButton = new JButton("Back");
        backButton.addActionListener(e -> controller.showMainMenu());

        add(progressLabel, BorderLayout.CENTER);
        add(backButton, BorderLayout.SOUTH);
    }
}

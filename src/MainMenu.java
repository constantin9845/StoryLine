import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

public class MainMenu extends JPanel {
    public MainMenu(GameController controller) {
        setLayout(new GridBagLayout());
        setBackground(Color.BLACK);

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(15, 15, 15, 15);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        JLabel title = new JLabel("Time Quest", SwingConstants.CENTER);
        title.setForeground(Color.WHITE);
        title.setFont(new Font("Serif", Font.BOLD, 42));

        JButton playButton = new JButton("Play");
        JButton progressButton = new JButton("Progress");
        JButton exitButton = new JButton("Exit");

        playButton.setFont(new Font("SansSerif", Font.BOLD, 24));
        progressButton.setFont(new Font("SansSerif", Font.BOLD, 24));
        exitButton.setFont(new Font("SansSerif", Font.BOLD, 24));

        playButton.addActionListener(e -> controller.startGame());
        progressButton.addActionListener(e -> controller.showProgress());
        exitButton.addActionListener(e -> controller.exitGame());

        gbc.gridy = 0;
        add(title, gbc);
        gbc.gridy = 1;
        add(playButton, gbc);
        gbc.gridy = 2;
        add(progressButton, gbc);
        gbc.gridy = 3;
        add(exitButton, gbc);
    }
}

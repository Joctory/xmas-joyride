<?php

function drive_leaderboard()
{
    // Fetch all posts of the custom post type 'winner'
    $args = array(
        'post_type' => 'winner',
        'posts_per_page' => 5, // Limit to 10 posts
        'orderby' => 'winner_score', // Order by a specific meta value (e.g., score)
        'order' => 'DESC', // Descending order
        'meta_key' => 'winner_score' // Specify the meta key to order by
    );
    $winners = get_posts($args);

    // Get the gamemail value from the URL
    $gamemail = isset($_GET['gamemail']) ? $_GET['gamemail'] : null;

    // Initialize an array to hold winner data
    $output = " "; // Change from string to array

    // Loop through each winner post and retrieve ACF fields
    foreach ($winners as $index => $winner) { // Add index to the loop
        $winner_data = get_fields($winner->ID); // Get all ACF fields for the winner
        // Determine the position
        $position = $index + 1;
        if ($index === 0) {
            $prposition = "gold";
            $badge = '<img src="https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/assets/rank1.png" class="rank" />';
        } elseif ($index === 1) {
            $prposition = "silver";
            $badge = '<img src="https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/assets/rank2.png" class="rank" />';
        } elseif ($index === 2) {
            $prposition = "bronze";
            $badge = '<img src="https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/assets/rank3.png" class="rank" />';
        }

        // Process the $winner_data as needed
        $output .= '<div class="row ' . esc_html($prposition) . '.">';
        $output .= '<div class="badge">' . esc_html($position) . '.</div>';
        $output .= '<div class="name">' . $badge . esc_html($winner_data['winner_name']) . '</div>';
        $output .= '<div class="score">' . esc_html($winner_data['winner_score']) . '</div>';
        $output .= '</div>';

        if ($gamemail === $winner_data['winner_email']) {
            $output .= '<div class="row player-row">';
            $output .= '<div class="badge">' . esc_html($position) . '.</div>';
            $output .= '<div class="name">' . $badge . 'You</div>';
            $output .= '<div class="score">' . esc_html($winner_data['winner_score']) . '</div>';
            $output .= '</div>';
        }
    }

    // Send the output as a JSON response
    return $output;
}

// Register the shortcode
add_shortcode('axs_drive_leaderboard', 'drive_leaderboard');

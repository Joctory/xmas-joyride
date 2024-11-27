<?php
add_action('wp_ajax_get_winner', 'get_winner_function');
add_action('wp_ajax_nopriv_get_winner', 'get_winner_function');
function get_winner_function()
{
    $data = $_POST['data'];
    $gamemail = $data["user_email"];

    // Get the current date
    $current_date = new DateTime();

    // Get the start of the week (Monday)
    $start_of_week = clone $current_date;
    $start_of_week->modify('monday this week');

    // Get the end of the week (Sunday)
    $end_of_week = clone $current_date;
    $end_of_week->modify('sunday this week');

    // Prepare the arguments for the query
    $args = array(
        'post_type' => 'winner',
        'posts_per_page' => 5, // Limit to 10 posts
        'orderby' => 'meta_value_num', // Order by numeric meta value
        'order' => 'DESC', // Descending order
        'meta_key' => 'winner_score', // Specify the meta key to order by
        'post_status' => 'publish', // Only get published posts
        'meta_query' => array(
            array(
                'key' => 'winner_score',
                'type' => 'NUMERIC' // Ensure winner_score is treated as a number
            )
        ),
        'date_query' => array(
            array(
                'after' => $start_of_week->format('Y-m-d'), // Start of the week
                'before' => $end_of_week->format('Y-m-d'), // End of the week
                'inclusive' => true, // Include the start and end dates
            ),
        ),
    );
    $winners = get_posts($args);


    // Initialize an array to hold winner data
    $output = " "; // Change from string to array

    // Loop through each winner post and retrieve ACF fields
    foreach ($winners as $index => $winner) { // Add index to the loop
        $winner_data = get_fields($winner->ID); // Get all ACF fields for the winner
        // Determine the position
        $position = $index + 1;
        if ($position === 1) {
            $prposition = "gold";
            $badge = '<img src="https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/assets/rank1.png" class="rank" />';
        } elseif ($position === 2) {
            $prposition = "silver";
            $badge = '<img src="https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/assets/rank2.png" class="rank" />';
        } elseif ($position === 3) {
            $prposition = "bronze";
            $badge = '<img src="https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/assets/rank3.png" class="rank" />';
        } else {
            $prposition = ""; // No badge for positions beyond 3
            $badge = ""; // No badge for positions beyond 3
        }

        // Process the $winner_data as needed
        $output .= '<div class="row ' . esc_html($prposition) . '">';
        $output .= '<div class="badge">' . esc_html($position) . '.</div>';
        $output .= '<div class="name">' . $badge . esc_html($winner_data['winner_name']) . '</div>';
        $output .= '<div class="score">' . esc_html($winner_data['winner_score']) . '</div>';
        $output .= '</div>';

        if (($gamemail != "unset" || $gamemail != null) && $gamemail === $winner_data['winner_email']) {
            $output .= '<div class="row player-row">';
            $output .= '<div class="badge">' . esc_html($position) . '.</div>';
            $output .= '<div class="name">' . $badge . 'You</div>';
            $output .= '<div class="score">' . esc_html($winner_data['winner_score']) . '</div>';
            $output .= '</div>';
        }
    }

    wp_send_json_success($output);
}

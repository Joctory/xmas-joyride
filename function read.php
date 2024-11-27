<?php
add_action('wp_ajax_get_winner', 'get_game_winner');
add_action('wp_ajax_nopriv_get_winner', 'get_game_winner');
function get_game_winner()
{
	$data = $_POST['data'];
	$gamemail = isset($data['user_email']) ? sanitize_email($data['user_email']) : null; // Sanitize email

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
				'after' => $data['current_monday'], // Start of the week
				'before' => $data['current_sunday'], // End of the week
				'inclusive' => true, // Include the start and end dates
			),
		),
	);
	$winners = get_posts($args);

	// Initialize an array to hold winner data
	$output = ""; // Change from string to array

	// Loop through each winner post and retrieve ACF fields
	if ($winners) {
		foreach ($winners as $index => $winner) { // Add index to the loop
			$winner_data = get_fields($winner->ID); // Get all ACF fields for the winner
			// Determine the position
			$position = $index + 1;
			if ($index === 0) {
				$prposition = "gold";
				$badge = '<img src="/christmas-joyride/assets/rank1.png" class="rank" />';
			} elseif ($index === 1) {
				$prposition = "silver";
				$badge = '<img src="/christmas-joyride/assets/rank2.png" class="rank" />';
			} elseif ($index === 2) {
				$prposition = "bronze";
				$badge = '<img src="/christmas-joyride/assets/rank3.png" class="rank" />';
			} else {
				$prposition = "";
				$badge = '';
			}

			// Process the $winner_data as needed
			$output .= '<div class="row ' . esc_html($prposition) . '">';
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
	} else {
		$output .= '<div class="no-winner">Currently no winner at this moment</div>';
	}

	wp_send_json_success($output);
}

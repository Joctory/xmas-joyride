<?php
add_action('wp_ajax_store_winner', 'post_game_winner');
add_action('wp_ajax_nopriv_store_winner', 'post_game_winner');

function post_game_winner()
{
	$data = $_POST['data'];
	$status = "";

	// Check if the form has been submitted
	if (isset($data['submit_winner'])) {
		$winner_name = sanitize_text_field($data['winner_name']);
		$winner_email = sanitize_email($data['winner_email']);
		$winner_score = intval($data['winner_score']); // Get the score from the hidden field

		// Ensure fields are not empty and score is valid
		if (!empty($winner_name) && is_email($winner_email) && $winner_score > 0) {

			// Query to check if a post with this winner email already exists
			$existing_winner = new WP_Query(array(
				'post_type' => 'winner',
				'meta_query' => array(
					array(
						'key' => 'winner_email',
						'value' => $winner_email,
						'compare' => '='
					)
				)
			));

			if ($existing_winner->have_posts()) {
				// Update existing winner's score
				$existing_winner->the_post();
				$post_id = get_the_ID();

				// Get the current score and update it
				$current_score = get_field('winner_score', $post_id);
				$new_score = $winner_score; // Add the new score to the current score
				//If new score is higher than current score
				if ($new_score > $current_score) {
					// Update the fields
					update_field('winner_name', $winner_name, $post_id); // Update name if needed
					update_field('winner_score', $new_score, $post_id);  // Update score
				}

				$status = "success";
			} else {
				// Create a new post for this winner
				$new_post = array(
					'post_title'    => $winner_name, // Set the post title as the winner's name
					'post_status'   => 'publish',    // Publish the post immediately
					'post_type'     => 'winner',     // Custom post type 'winner'
					'post_content'  => '',           // You can add more details here if needed
				);

				// Insert the new post into the database
				$post_id = wp_insert_post($new_post);

				// If the post was successfully created, save the custom fields
				if ($post_id) {
					update_field('winner_name', $winner_name, $post_id);
					update_field('winner_email', $winner_email, $post_id);
					update_field('winner_score', $winner_score, $post_id);

					$status = "success";
				} else {
					$status = "fail";
				}
			}

			// Reset post data (important after WP_Query)
			wp_reset_postdata();
			wp_send_json_success($status);
		}
	}
}

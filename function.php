<?php

// Function to create the form and process submission
function add_winner_shortcode()
{
    ob_start(); // Start output buffering

    // Retrieve the winner score from the URL using the GET method
    $winner_score = isset($_GET['score']) ? intval($_GET['score']) : 0; // Default to 0 if not provided

    // Check if the form has been submitted
    if (isset($_POST['submit_winner'])) {
        $winner_name = sanitize_text_field($_POST['winner_name']);
        $winner_email = sanitize_email($_POST['winner_email']);
        $winner_score = intval($_POST['winner_score']); // Get the score from the hidden field

        // Ensure fields are not empty
        if (!empty($winner_name) && !empty($winner_email) && !empty($winner_score)) {

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
                $new_score = $current_score + $winner_score; // Add the new score to the current score

                // Update the fields
                update_field('winner_name', $winner_name, $post_id); // Update name if needed
                update_field('winner_score', $new_score, $post_id);  // Update score

                echo '<p>Winner score updated successfully!</p>';
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

                    echo '<p>New winner added successfully!</p>';
                } else {
                    echo '<p>Failed to save winner data.</p>';
                }
            }

            // Reset post data (important after WP_Query)
            wp_reset_postdata();
        } else {
            echo '<p>Please fill in all fields.</p>';
        }
    }

    // Form HTML
?>
    <form method="POST">
        <label for="winner_name">Winner Name:</label>
        <input type="text" id="winner_name" name="winner_name" required>

        <label for="winner_email">Winner Email:</label>
        <input type="email" id="winner_email" name="winner_email" required>

        <!-- Hidden field for winner score retrieved from the URL -->
        <input type="hidden" id="winner_score" name="winner_score" value="<?php echo $winner_score; ?>">

        <input type="submit" name="submit_winner" value="Submit Winner">
    </form>
<?php

    return ob_get_clean(); // Return the output buffer content
}

// Register the shortcode
add_shortcode('add_winner', 'add_winner_shortcode');

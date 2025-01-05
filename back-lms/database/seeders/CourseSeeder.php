<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Course;
use App\Models\CourseSection;
use App\Models\SectionLesson;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = \App\Models\User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'is_admin' => true,
            'is_active' => true,
            'profile_image' => null,
        ]);

        $user1 = \App\Models\User::factory()->create([
            'name' => 'Test User2',
            'email' => 'test2@example.com',
            'is_active' => false,
            'is_admin' => true,
            'profile_image' => null,
        ]);


        $category1 = Category::factory()->create([
            'name' => 'PHP',
            'slug' => 'PHP'
        ]);

        $category2 = Category::factory()->create([
            'name' => 'Javascript',
            'slug' => 'javascript'
        ]);

        $category3 = Category::factory()->create([
            'name' => 'CSS',
            'slug' => 'css'
        ]);

        // first course
        $course1 = Course::factory()->create([
            'user_id' => $user->id,
            'category_id' => $category1->id,
            'title' => 'Learn how to write a PHP application from scratch12',
            'short_description' => 'Lorem ipsum dolor sit amet consectetur adipisicing elit. ',
            'is_free' => true,
            'type' => 'recorded',
            'preview_image' =>  'https://transvelo.github.io/skola-html/5.1/assets/img/products/product-1.jpg',
            'description' => 'Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                            Consequatur fugit unde vitae neque inventore facilis esse ipsum quidem animi quibusdam.
                            Vel quia voluptatum veniam optio illo impedit hic esse dolorum.',
            'status' => 'draft',
        ]);

        $course1->courseSections()->saveMany([
            new CourseSection([
                'course_id' => $course1->id,
                'order' => 0,
                'title' => 'Introduction',
                'description' => 'Introduction to our project'
            ]),
            new CourseSection([
                'course_id' => $course1->id,
                'order' => 1,
                'title' => 'Setting up the database',
                'description' => 'Set up the databsae'
            ]),
            new CourseSection([
                'course_id' => $course1->id,
                'order' => 2,
                'title' => 'Writting up the code',
                'description' => 'Write the code'
            ])
        ]);

        $course1->courseSections[1]->sectionLessons()->saveMany([
            new SectionLesson([
                'order' => 0,
                'course_id' => $course1->id,
                'title' => 'What is a database?',
                'description' => 'What is really a databse mate?',
                'video' => '',
            ]),
            new SectionLesson([
                'order' => 1,
                'course_id' => $course1->id,
                'title' => 'MYSQL database?',
                'description' => 'Learning about MYSQL database?',
                'video' => '',
            ]),
        ]);

        $course2 = Course::factory()->create([
            'user_id' => $user->id,
            'category_id' => $category2->id,
            'title' => 'Learn how to write a PHP application from scratch13',
            'short_description' => 'Lorem ipsum dolor sit amet consectetur adipisicing elit. ',
            'is_free' => false,
            'type' => 'recorded',
            'preview_image' =>  'https://transvelo.github.io/skola-html/5.1/assets/img/products/product-1.jpg',
            'description' => 'Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                            Consequatur fugit unde vitae neque inventore facilis esse ipsum quidem animi quibusdam.
                            Vel quia voluptatum veniam optio illo impedit hic esse dolorum.',
            'status' => 'draft',
        ]);

        $course2->courseSections()->saveMany([
            new CourseSection([
                'course_id' => $course2->id,
                'order' => 0,
                'title' => 'Introduction',
                'description' => 'Introduction to our project'
            ]),
            new CourseSection([
                'course_id' => $course2->id,
                'order' => 1,
                'title' => 'Setting up the database',
                'description' => 'Set up the databsae'
            ]),
            new CourseSection([
                'course_id' => $course2->id,
                'order' => 2,
                'title' => 'Writting up the code',
                'description' => 'Write the code'
            ])
        ]);

        $course2->courseSections[1]->sectionLessons()->saveMany([
            new SectionLesson([
                'order' => 0,
                'course_id' => $course1->id,
                'title' => 'What is a database?',
                'description' => 'What is really a databse mate?',
                'video' => '',
            ]),
            new SectionLesson([
                'order' => 1,
                'course_id' => $course1->id,
                'title' => 'MYSQL database?',
                'description' => 'Learning about MYSQL database?',
                'video' => '',
            ]),
        ]);

        $course3 = Course::factory()->create([
            'user_id' => $user1->id,
            'category_id' => $category3->id,
            'title' => 'Learn how to write a PHP application from scratch14',
            'short_description' => 'Lorem ipsum dolor sit amet consectetur adipisicing elit. ',
            'is_free' => false,
            'type' => 'recorded',
            'preview_image' =>  'https://transvelo.github.io/skola-html/5.1/assets/img/products/product-1.jpg',
            'description' => 'Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                            Consequatur fugit unde vitae neque inventore facilis esse ipsum quidem animi quibusdam.
                            Vel quia voluptatum veniam optio illo impedit hic esse dolorum.',
            'status' => 'draft',
        ]);

        $course3->courseSections()->saveMany([
            new CourseSection([
                'course_id' => $course3->id,
                'order' => 0,
                'title' => 'Introduction',
                'description' => 'Introduction to our project'
            ]),
            new CourseSection([
                'course_id' => $course3->id,
                'order' => 1,
                'title' => 'Setting up the database',
                'description' => 'Set up the databsae'
            ]),
            new CourseSection([
                'course_id' => $course3->id,
                'order' => 2,
                'title' => 'Writting up the code',
                'description' => 'Write the code'
            ])
        ]);

        $course3->courseSections[1]->sectionLessons()->saveMany([
            new SectionLesson([
                'order' => 0,
                'course_id' => $course1->id,
                'title' => 'What is a database?',
                'description' => 'What is really a databse mate?',
                'video' => '',
            ]),
            new SectionLesson([
                'order' => 1,
                'course_id' => $course1->id,
                'title' => 'MYSQL database?',
                'description' => 'Learning about MYSQL database?',
                'video' => '',
            ]),
        ]);

        $course4 = Course::factory()->create([
            'user_id' => $user1->id,
            'category_id' => $category3->id,
            'title' => 'Learn how to write a PHP application from scratch',
            'short_description' => 'Lorem ipsum dolor sit amet consectetur adipisicing elit. ',
            'is_free' => false,
            'type' => 'recorded',
            'preview_image' =>  'https://transvelo.github.io/skola-html/5.1/assets/img/products/product-1.jpg',
            'description' => 'Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                            Consequatur fugit unde vitae neque inventore facilis esse ipsum quidem animi quibusdam.
                            Vel quia voluptatum veniam optio illo impedit hic esse dolorum.',
            'status' => 'draft',
        ]);
    }
}

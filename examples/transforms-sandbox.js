import {tiny, defs} from './common.js';

                                                  // Pull these names into this module's scope for convenience:
const { vec3, vec4, color, Mat4, Shape, Material, Shader, Texture, Component } = tiny;

export
const Transforms_Sandbox_Base = defs.Transforms_Sandbox_Base =
class Transforms_Sandbox_Base extends Component
{                                          // **Transforms_Sandbox_Base** is a Scene that can be added to any display canvas.
                                           // This particular scene is broken up into two pieces for easier understanding.
                                           // The piece here is the base class, which sets up the machinery to draw a simple
                                           // scene demonstrating a few concepts.  A subclass of it, Transforms_Sandbox,
                                           // exposes only the display() method, which actually places and draws the shapes,
                                           // isolating that code so it can be experimented with on its own.
  init()
    {
                        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
      this.hover = this.swarm = false;
                                                        // At the beginning of our program, load one of each of these shape
                                                        // definitions onto the GPU.  NOTE:  Only do this ONCE per shape it
                                                        // would be redundant to tell it again.  You should just re-use the
                                                        // one called "box" more than once in display() to draw multiple cubes.
                                                        // Don't define more than one blueprint for the same thing here.
      this.shapes = { 'box'  : new defs.Cube(),
                      'ball' : new defs.Subdivision_Sphere( 4 ) };

                                                  // *** Materials: ***  A "material" used on individual shapes specifies all fields
                                                  // that a Shader queries to light/color it properly.  Here we use a Phong shader.
                                                  // We can now tweak the scalar coefficients from the Phong lighting formulas.
                                                  // Expected values can be found listed in Phong_Shader::update_GPU().
      const phong = new defs.Phong_Shader();
      this.materials = {};
      this.materials.plastic = { shader: phong, ambient: .2, diffusivity: 1, specularity: .5, color: color( .9,.5,.9,1 ) }
      this.materials.metal   = { shader: phong, ambient: .2, diffusivity: 1, specularity:  1, color: color( .9,.5,.9,1 ) }
    }
  make_control_panel()
    {                                 // make_control_panel(): Sets up a panel of interactive HTML elements, including
                                      // buttons with key bindings for affecting this scene, and live info readouts.
      this.control_panel.innerHTML += "Dragonfly rotation angle: <br>";
                                                // The next line adds a live text readout of a data member of our Scene.
      this.live_string( box => { box.textContent = ( this.hover ? 0 : ( this.t % (2*Math.PI)).toFixed(2) ) + " radians" } );
      this.new_line();
                                                // Add buttons so the user can actively toggle data members of our Scene:

      // Keep one of these buttons in your animation, since being able to freeze
      // your animation at any moment is often helpful for diagnosis!
      this.key_triggered_button( "(Un)pause animation", ["Alt", "a"], () => this.uniforms.animate ^= 1 );
      this.new_line();
      this.key_triggered_button( "Hover dragonfly in place", [ "h" ], function() { this.hover ^= 1; } );
      this.new_line();
      this.key_triggered_button( "Swarm mode", [ "m" ], function() { this.swarm ^= 1; } );
    }
  render_animation( caller )
    {                                                // display():  Called once per frame of animation.  We'll isolate out
                                                     // the code that actually draws things into Transforms_Sandbox, a
                                                     // subclass of this Scene.  Here, the base class's display only does
                                                     // some initial setup.

                           // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
      if( !caller.controls )
        { this.animated_children.push( caller.controls = new defs.Movement_Controls( { uniforms: this.uniforms } ) );
          caller.controls.add_mouse_controls( caller.canvas );

                    // Define the global camera and projection matrices, which are stored in shared_uniforms.  The camera
                    // matrix follows the usual format for transforms, but with opposite values (cameras exist as
                    // inverted matrices).  The projection matrix follows an unusual format and determines how depth is
                    // treated when projecting 3D points onto a plane.  The Mat4 functions perspective() or
                    // orthographic() automatically generate valid matrices for one.  The input arguments of
                    // perspective() are field of view, aspect ratio, and distances to the near plane and far plane.

          Shader.assign_camera( Mat4.translation( 0,3,-10 ), this.uniforms );
        }
      this.uniforms.projection_transform = Mat4.perspective( Math.PI/4, caller.width/caller.height, 1, 100 );

                                                // *** Lights: *** Values of vector or point lights.  They'll be consulted by
                                                // the shader when coloring shapes.  See Light's class definition for inputs.
      const t = this.t = this.uniforms.animation_time/1000;
      const angle = Math.sin( t );
      const light_position = Mat4.rotation( angle,   1,0,0 ).times( vec4( 0,-1,1,0 ) );
      this.uniforms.lights = [ defs.Phong_Shader.light_source( light_position, color( 1,1,1,1 ), 1000000 ) ];
    }
}


export class Transforms_Sandbox extends Transforms_Sandbox_Base
{                                                    // **Transforms_Sandbox** is a Scene object that can be added to any display canvas.
                                                     // This particular scene is broken up into two pieces for easier understanding.
                                                     // See the other piece, Transforms_Sandbox_Base, if you need to see the setup code.
                                                     // The piece here exposes only the display() method, which actually places and draws
                                                     // the shapes.  We isolate that code so it can be experimented with on its own.
                                                     // This gives you a very small code sandbox for editing a simple scene, and for
                                                     // experimenting with matrix transformations.
  render_animation( caller )
    {                                                // display():  Called once per frame of animation.  For each shape that you want to
                                                     // appear onscreen, place a .draw() call for it inside.  Each time, pass in a
                                                     // different matrix value to control where the shape appears.

                                                     // Variables that are in scope for you to use:
                                                     // this.shapes.box:   A vertex array object defining a 2x2x2 cube.
                                                     // this.shapes.ball:  A vertex array object defining a 2x2x2 spherical surface.
                                                     // this.materials.metal:    Selects a shader and draws with a shiny surface.
                                                     // this.materials.plastic:  Selects a shader and draws a more matte surface.
                                                     // this.lights:  A pre-made collection of Light objects.
                                                     // this.hover:  A boolean variable that changes when the user presses a button.
                                                     // shared_uniforms:  Information the shader needs for drawing.  Pass to draw().
                                                     // caller:  Wraps the WebGL rendering context shown onscreen.  Pass to draw().

                                                // Call the setup code that we left inside the base class:
      super.render_animation( caller );

      /**********************************
      Start coding down here!!!!
      **********************************/
                                                  // From here on down it's just some example shapes drawn for you -- freely
                                                  // replace them with your own!  Notice the usage of the Mat4 functions
                                                  // translation(), scale(), and rotation() to generate matrices, and the
                                                  // function times(), which generates products of matrices.

      const blue = color( 0,0,1,1 ), yellow = color( 1,1,0,1 );


                                    // Variable model_transform will be a local matrix value that helps us position shapes.
                                    // It starts over as the identity every single frame - coordinate axes at the origin.
      let model_transform = Mat4.identity();
                                                     // Draw a hierarchy of objects that appear connected together.  The first shape
                                                     // will be the "parent" or "root" of the hierarchy.  The matrices of the
                                                     // "child" shapes will use transformations that are calculated as relative
                                                     // values, based on the parent shape's matrix.  Moving the root node should
                                                     // therefore move the whole hierarchy.  To perform this, we'll need a temporary
                                                     // matrix variable that we incrementally adjust (by multiplying in new matrix
                                                     // terms, in between drawing shapes).  We'll draw the parent shape first and
                                                     // then incrementally adjust the matrix it used to draw child shapes.

                                                     // Position the root shape.  For this example, we'll use a box
                                                     // shape, and place it at the coordinate origin 0,0,0:
      model_transform = model_transform.times( Mat4.translation( 0,0,0 ) );
                                                                                              // Draw the top box:
      this.shapes.box.draw( caller, this.uniforms, model_transform, { ...this.materials.plastic, color: yellow } );

                                                     // Tweak our coordinate system downward 2 units for the next shape.
      model_transform = model_transform.times( Mat4.translation( 0, -2, 0 ) );
                                                                           // Draw the ball, a child of the hierarchy root.
                                                                           // The ball will have its own children as well.
      this.shapes.ball.draw( caller, this.uniforms, model_transform, { ...this.materials.metal, color: blue } );

                                                                      // Prepare to draw another box object 2 levels deep
                                                                      // within our hierarchy.
                                                                      // Find how much time has passed in seconds; we can use
                                                                      // time as an input when calculating new transforms:
      const t = this.t = this.uniforms.animation_time/1000;

                                                      // Spin our current coordinate frame as a function of time.  Only do
                                                      // this movement if the button on the page has not been toggled off.
      if( !this.hover )
        model_transform = model_transform.times( Mat4.rotation( t,   0,1,0 ) )

                                                      // Perform three transforms in a row.
                                                      // Rotate the coordinate frame counter-clockwise by 1 radian,
                                                      // Scale it longer on its local Y axis,
                                                      // and lastly translate down that scaled Y axis by 1.5 units.
                                                      // That translation is enough for the box and ball volume to miss
                                                      // one another (new box radius = 2, ball radius = 1, coordinate
                                                      // frame axis is currently doubled in size).
      model_transform   = model_transform.times( Mat4.rotation( 1,     0,0,1 ) )
                                         .times( Mat4.scale      ( 1,   2, 1 ) )
                                         .times( Mat4.translation( 0,-1.5, 0 ) );
                                                                                    // Draw the bottom (child) box:
      this.shapes.box.draw( caller, this.uniforms, model_transform, { ...this.materials.plastic, color: yellow } );

                              // Note that our coordinate system stored in model_transform still has non-uniform scaling
                              // due to our scale() call.  This could have undesired effects for subsequent transforms;
                              // rotations will behave like shears.  To avoid this it may have been better to do the
                              // scale() last and then immediately unscale after the draw.  Or better yet, don't store
                              // the scaled matrix back in model_transform at all -- but instead in just a temporary
                              // expression that we pass into draw(), or store under a different name.
    }
}

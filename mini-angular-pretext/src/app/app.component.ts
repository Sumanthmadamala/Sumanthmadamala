import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { layout, prepare } from '@chenglou/pretext';

type BubbleModel = {
  text: string;
  predictedHeight: number;
  predictedLines: number;
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  readonly font = '16px Inter';
  readonly lineHeight = 24;
  readonly maxBubbleWidth = 320;

  readonly draftMessage = signal('Pretext lets Angular estimate this bubble height before rendering.');

  readonly bubble = computed<BubbleModel>(() => {
    const text = this.draftMessage().trim() || 'Type a message to predict bubble height.';
    const prepared = prepare(text, this.font);
    const result = layout(prepared, this.maxBubbleWidth, this.lineHeight);

    return {
      text,
      predictedHeight: result.height,
      predictedLines: result.lineCount
    };
  });
}

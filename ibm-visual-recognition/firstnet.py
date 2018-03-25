import json
from watson_developer_cloud import VisualRecognitionV3
from tkinter import *
from watson_developer_cloud import WatsonApiException
import random
from tkinter import ttk
from tkinter import filedialog, messagebox
from PIL import ImageTk,Image



def visual_recog(filename):
    print('Processing image and analysing best strategy!')
    visual_recognition = VisualRecognitionV3(
            '2016-05-20',
            api_key='a39feebd0865efe2e9d601690311351a66786c25')
    visual_recognition.set_default_headers({'x-watson-learning-opt-out': "true"})

    labels = []
    with open(filename, 'rb') as images_file:
        classes = visual_recognition.classify(
                images_file,
                parameters=json.dumps({
                    'threshold': 0.1
                }))
        print('Image loaded')
        print(json.dumps(classes, indent=2))
        response = (json.dumps(classes, indent=2)).replace("'", '"')
        response = json.loads(response)
        for classifiers in response['images']:
            for classifier in classifiers['classifiers']:
                for classes in classifier['classes']:
                    labels.append(classes['class'])
        print('Returning strategy!')
        return labels

filename = 'fire.jpg'


root = Tk()

messagebox.askyesno("Title","FIRE AWAY! \n\nCapturing LIVE STREAM AT LOCATION 23 DICKSON \n\nAnalyze images from drone ?")

root.filename =  filedialog.askopenfilename(initialdir = "/",title = "Select file",filetypes = (("jpeg files","*.jpg"),("all files","*.*")))
print (root.filename)
print ('File Selected: ', root.filename)
canvas = Canvas(root, width = 800, height = 800)
canvas.pack()
img = ImageTk.PhotoImage(Image.open(root.filename))

labels = visual_recog(root.filename)
print('Labels', labels)
canvas.create_image(20, 20, anchor=NW, image=img)
i = 20
j = 20
#labels = ['fire engine', 'truck', 'wheeled vehicle', 'vehicle', 'fire marshall', 'person', 'fireman', 'Parade', 'ultramarine color', 'alizarine red color']
for label in labels:
    canvas_id = canvas.create_text(i, j, anchor="nw")
    i =random.randint(0, 400)
    j = random.randint(0, 400)
    canvas.itemconfig(canvas_id, text=label, width=780)
    canvas.itemconfig(canvas_id, font=("courier", 25),  fill="white", activefill="blue")
    #canvas.create_text(100,10,fill="darkblue",font="Times 20 italic bold",
                       # text=label)
strategy = canvas.create_text(5, 430, anchor="nw")
test_string = 'Optimising fire fighting strategy based on: \n\n(1) '+labels[0]+'\n(2) '+labels[1]\
              +'\n(3) '+labels[2]+'\n\nSending suggested movement to firefighters:\n\n--> Truck parking: Backyard\n--> F1 @ Backdoor\n--> F2 @ Fire Hydrant by the elevator\n--> F3 @ Basement'
canvas.itemconfig(strategy, text='Optimising fire fighting strategy based on:')

delta = 100
delay = 0
for i in range(len(test_string) + 1):
    s = test_string[:i]
    update_text = lambda s=s: canvas.itemconfig(strategy, text=s)
    canvas.itemconfig(strategy, font=("courier", 30), fill="black", activefill="blue")
    canvas.after(delay, update_text)
    delay += delta

root.mainloop()